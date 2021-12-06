from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials
from PIL import Image

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
      res = {
        'username' : username,
        'access_token' : access_token,
        'type' : data_user['type']
      }
      return res, 201
    else:
      return {}, 200
  else:
    return {}, 204

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
    paslon_id = request.form.get('paslon_id')
    file = request.files['img']
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
      "img_url" : photo.metadata['alternateLink']
    }
    db.collection('votes').add(vote)
    return {}, 201
  else:
    return {}, 204


if __name__ == "__main__":
  app.run(debug=True)