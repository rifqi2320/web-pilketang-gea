from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_jwt_extended.utils import get_jwt
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime

# GDrive Stuff
gauth = GoogleAuth()
scope = ["https://www.googleapis.com/auth/drive"]
gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('venv/credentials.json', scope)
drive = GoogleDrive(gauth)

# Firebase Stuff
cred = credentials.Certificate('venv/firebase_credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Flask Stuff
app = Flask(__name__)
CORS(app)

#JWT Stuff
app.config["JWT_SECRET_KEY"] = "pilketang-gea"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
jwt = JWTManager(app)

@app.route("/login", methods=['POST'])
def login():
  username = request.json.get('username')
  password = request.json.get('password')
  if type(username) != str or type(password) != str:
    return {}, 400
  user = db.collection('users').where(u'nim', u'==', username).where(u'password', u'==', password).get()
  if user:
    data_user = user[0].to_dict()
    if password == data_user['password']:
      access_token = create_access_token(identity=username)
      res = data_user
      res['password'] = access_token
      return res, 201
    else:
      return {}, 401
  else:
    return {}, 400

@app.route("/vote", methods=['POST'])
@jwt_required()
def vote():
  username = get_jwt_identity()
  user = db.collection('users').where(u'nim', u'==', username).get()
  if user:
    user_id = user[0].id
    db.collection('users').document(user_id).update(
      {"isVoted" : 1}
    )
    paslon_id = int(request.form.get('paslon_id'))
    vote_status = request.form.get('vote_status')
    if not vote_status:
      vote_status = 0
    file = request.files.get('img')
    file.save("static/uploads/temp.jpg")
    photo = drive.CreateFile(
      {
        "title" : "{}".format(user_id),
        "parents" : [{'id' : "1-pkpOj-PbWrOaUfHoeqvrsUvS-f1D126" }]
      }
    )
    photo.SetContentFile("static/uploads/temp.jpg")
    photo.Upload()
    photo.FetchMetadata()
    vote = {
      "username" : username,
      "paslon_id" : paslon_id,
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "img_url" : photo.metadata['alternateLink'],
      "status" : vote_status
    }
    db.collection('votes').add(vote)
    return {}, 202
  else:
    return {}, 400

@app.route("/review", methods=["PUT"])
@jwt_required()
def reviewVote():
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  username = request.json.get('nim')
  user = db.collection('users').where(u'nim', u'==', username).get()
  vote = db.collection('votes').where(u'nim', u'==', username).get()
  if user and vote:
    action = request.json.get('action')
    user_id = user[0].id
    vote_id = vote[0].id
    if action == "Accept":
      db.collection('users').document(user_id).update(
        {"isVoted" : 3} # User ditandai sudah vote
      )
      db.collection('votes').document(vote_id).update(
        {"status" : 2} # Vote ditandai valid
      )
      return {}, 201
    elif action == "Reject":
      db.collection('users').document(user_id).update(
        {"isVoted" : 2} # User ditandai dengan vote bermasalah
      )
      db.collection('votes').document(vote_id).update(
        {"status" : 1} # Vote ditandai tidak valid
      )
      return {}, 201
    else:
      return {}, 400
  else:
    return {}, 400

@app.route("/get_queue_votes")
@jwt_required()
def get_queue_votes():
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  votes = db.collection('votes').where(u"status", u"==", 0).get()
  if votes:
    res = {
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "data" : [x.to_dict() for x in votes]
    }
    return res, 200
  else:
    return {}, 204

@app.route("/status")
def get_status_votes():
  votes = db.collection('votes').get()
  res = {
    "Not Voted" : len(db.collection('users').get()),
    "Voted" : 0,
    "In Progress" : 0,
    "Validated" : 0,
    "Rejected" : 0
  }
  for vote in votes:
    temp = vote.to_dict()
    res["Voted"] += 1
    res["Not Voted"] -= 1
    if temp["status"] == 0:
      res["In Progress"] += 1
    elif temp["status"] == 1:
      res["Rejected"] += 1
    elif temp["status"] == 2:
      res["Validated"] += 1
  return res, 200
  
if __name__ == "__main__":
  app.run(debug=True)