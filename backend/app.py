from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
from pymongo import MongoClient

# GDrive Stuff
gauth = GoogleAuth()
scope = ["https://www.googleapis.com/auth/drive"]
gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('venv/credentials.json', scope)
drive = GoogleDrive(gauth)

# MongoDB Stuff
cluster = MongoClient("mongodb+srv://vito:ZBv1zgjEjFtt9k7x@cluster0.epqqw.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = cluster["pilketang-gea"]

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
  user = db["users"].find_one({"username":username})
  if user:
    data_user = user
    if password == data_user['password']:
      access_token = create_access_token(identity=username)
      res = data_user
      res.pop("_id", None)
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
  user = db["users"].find_one({"username" : username})
  if user:
    if user["isVoted"] % 2 != 0:
      return {}, 401
    db["users"].find_one_and_update({"username" : username}, {
      "$set" : {"isVoted" : 1}
    })
    bph_id = request.form.get('bph_id')
    senator_id = request.form.get('senator_id')
    vote_status = request.form.get('vote_status')
    if not vote_status:
      vote_status = 0
    file = request.files.get('img')
    file.save("static/uploads/temp.jpg")
    photo = drive.CreateFile(
      {
        "title" : "{}".format(username),
        "parents" : [{'id' : "1-pkpOj-PbWrOaUfHoeqvrsUvS-f1D126" }]
      }
    )
    photo.SetContentFile("static/uploads/temp.jpg")
    photo.Upload()
    photo.FetchMetadata()
    vote = {
      "username" : username,
      "bph_id" : bph_id,
      "senator_id" : senator_id,
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "img_url" : photo.metadata['alternateLink'],
      "status" : vote_status
    }
    db["votes"].insert_one(vote)
    return {}, 202
  else:
    return {}, 400

@app.route("/review", methods=["POST"])
@jwt_required()
def reviewVote():
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  username = request.json.get('username')
  user = db["users"].find_one({"username" : username})
  vote = db["votes"].find_one({"username" : username})
  if user and vote:
    action = request.json.get('action')
    if action == "Accept":
      db["users"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {"isVoted" : 3} # User ditandai sudah vote
        }
      )
      db["votes"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {"status" : 2} # Vote ditandai valid
        }
      )
      return {}, 201
    elif action == "Reject":
      db["users"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {"isVoted" : 2} # User ditandai dengan vote bermasalah
        }
      )
      db["votes"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {"status" : 1} # Vote ditandai tidak valid
        }
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
  votes = db["votes"].find({"status" : 0})
  if votes:
    res = {
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "data" : [x for x in votes]
    }
    return res, 200
  else:
    return {}, 204

@app.route("/status")
def send_status():
  global status_votes
  if status_votes["Valid"]:
    return status_votes, 200
  else:
    return get_status_votes(), 200
  

status_votes = {
  "Not Voted" : db["users"].count_documents({}) - 1,
  "Voted" : 0,
  "In Progress" : 0,
  "Validated" : -1,
  "Rejected" : 0,
  "Valid" : False
}

def get_status_votes():
  global status_votes
  votes = db["votes"]
  status_votes = {
    "Not Voted" : db["users"].count_documents({}) - 1,
    "Voted" : 0,
    "In Progress" : 0,
    "Validated" : -1,
    "Rejected" : 0,
    "Valid" : True
  }
  for vote in votes:
    temp = vote
    status_votes["Voted"] += 1
    status_votes["Not Voted"] -= 1
    if temp["status"] == 0:
      status_votes["In Progress"] += 1
    elif temp["status"] == 1:
      status_votes["Rejected"] += 1
    elif temp["status"] == 2:
      status_votes["Validated"] += 1
  return status_votes, 200


# Untuk Counting
isCounting = False # State counting
tempPaslon = [True, True, True] # State paslon
tempVote = [] # Seluruh data counting
tempTime = datetime.now()

@app.route("/start_count", methods=["POST"])
# @jwt_required
def start_count():
  global isCounting, tempVote, tempTime
  # identity = get_jwt_identity() 
  # if identity != "admin":
  #   return {}, 401
  if not isCounting:
    isCounting = True
    tempVote = [x for x in db["votes"].find({"status" : 2})]
    tempTime = datetime.now()
    return {}, 200
  else:
    return {}, 400

@app.route("/stop_count", methods=["POST"])
def stop_count():
  global isCounting, tempVote, tempTime
  identity = get_jwt_identity() 
  if identity != "admin":
    return {}, 401
  if isCounting:
    isCounting = False
    return {}, 200
  else:
    return {}, 400

def get_vote(arrVote):
  global tempPaslon
  for paslon in arrVote:
    if paslon == -1:
      continue
    if tempPaslon[paslon]:
      return paslon
  return -1

@app.route("/get_count")
def get_count():
  global isCounting, tempVote, tempTime
  if isCounting:
    t = datetime.now()
    n = int(min(len(tempVote), (t - tempTime).total_seconds()//5)) # 5 nya waktu per vote terhintung
    res = {
      "timestamp" : t.strftime("%d-%b-%Y (%H:%M:%S)"),
      "data" : [0 for _ in range(3)],
      "percentage" : 100*n/len(tempVote)
    }
    for vote in tempVote[:n]:
      x = get_vote(vote["paslon_id"])
      if x >= 0:
        res["data"][x] += 1
    return res
  else:
    return {}, 204

if __name__ == "__main__":
  app.run(debug=True)