import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
from pymongo import MongoClient
from PIL import Image
from io import BytesIO
from base64 import b64decode

# GDrive Stuff
gauth = GoogleAuth()
scope = ["https://www.googleapis.com/auth/drive"]
gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secrets.json', scope)
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

#State Backend
isVoting = False
isFinished = False

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

@app.route("/user_data")
@jwt_required()
def get_user_data():
  username = get_jwt_identity()
  user = db["users"].find_one({"username":username})
  if user:
    res = user
    res.pop("_id", None)
    res.pop("password", None)
    res["vote_enabled"] = isVoting
    return res, 200
  else:
    return {}, 400

@app.route("/start_voting", methods=["POST"])
@jwt_required()
def user_start_vote():
  username = get_jwt_identity()
  user = db["users"].find_one({"username":username})
  if user:
    time = (datetime.now() - datetime(1970, 1, 1)).total_seconds()
    if user["startTime"] == 0:
      db["users"].find_one_and_update({"username" : username}, {
          "$set" : {"startTime" : time}
        })
    return {"startTime" : time}, 202
  else:
    return {}, 400

@app.route("/vote", methods=['POST'])
@jwt_required()
def vote():
  global drive
  if not isVoting:
    return {}, 401
  username = get_jwt_identity()
  user = db["users"].find_one({"username" : username})
  if user:
    if user["isVoted"] == 1 or user["isVoted"] == 3:
      return {}, 401
    bph_id = request.json.get('bph_id')
    senator_id = request.json.get('senator_id')
    img_data = request.json.get('img_data')
    timeTaken = request.json.get('timeTaken')
    status = request.json.get('status_code')
    if not status:
      try:
        im = Image.open(BytesIO(b64decode(img_data.split("data:image/jpeg;base64,")[1])))
        im.save("static/uploads/temp.jpg")
        photo = drive.CreateFile(
          {
            "title" : "{}".format(username),
            "parents" : [{'id' : "1-pkpOj-PbWrOaUfHoeqvrsUvS-f1D126" }]
          }
        )
        photo.SetContentFile("static/uploads/temp.jpg")
        photo.Upload()
        photo.FetchMetadata()
        link = photo.metadata['alternateLink'].replace("https://drive.google.com/file/d/", "https://drive.google.com/uc?export=view&id=").replace("/view?usp=drivesdk", "")
      except:
        gauth = GoogleAuth()
        scope = ["https://www.googleapis.com/auth/drive"]
        gauth.credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secrets.json', scope)
        drive = GoogleDrive(gauth)
        im = Image.open(BytesIO(b64decode(img_data.split("data:image/jpeg;base64,")[1])))
        im.save("static/uploads/temp.jpg")
        photo = drive.CreateFile(
          {
            "title" : "{}".format(username),
            "parents" : [{'id' : "1-pkpOj-PbWrOaUfHoeqvrsUvS-f1D126" }]
          }
        )
        photo.SetContentFile("static/uploads/temp.jpg")
        photo.Upload()
        photo.FetchMetadata()
        link = photo.metadata['alternateLink'].replace("https://drive.google.com/file/d/", "https://drive.google.com/uc?export=view&id=").replace("/view?usp=drivesdk", "")
    else:
      link = ""
    vote = {
      "username" : username,
      "bph_id" : bph_id,
      "senator_id" : senator_id,
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "review_timestamp" : datetime.now(),
      "img_url" : link,
      "timeTaken" : timeTaken,
      "status" : status
    }
    db["votes"].delete_one({"username" : username})
    db["votes"].insert_one(vote)
    if link == "":
      db["users"].find_one_and_update({"username" : username}, {
        "$set" : {"isVoted" : 3}
      })
    else:
      db["users"].find_one_and_update({"username" : username}, {
        "$set" : {"isVoted" : 1}
      })
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
          "$set" : {"isVoted" : 4} # User ditandai sudah vote
        }
      )
      db["votes"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {
            "status" : 2,
            "review_timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)")
          } # Vote ditandai valid
        }
      )
      return {}, 201
    elif action == "Delete":
      db["users"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {"isVoted" : 3} # User ditandai dengan vote dihapus
        }
      )
      db["votes"].find_one_and_update(
        {"username" : username},
        {
          "$set" : {
            "status" : 1,
            "review_timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)")
          } # Vote ditandai tidak valid
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
          "$set" : {
            "status" : 1,
            "review_timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)")
          } # Vote ditandai tidak valid
        }
      )
      return {}, 201
    else:
      return {}, 400
  else:
    return {}, 400

@app.route("/get_user", methods=["POST"])
@jwt_required()
def get_user():
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  nim = request.json.get("nim")
  user = db["users"].find_one({"username" : nim})
  if user:
    res = {
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "data" : user
    }
    res["data"].pop("_id", None)
    res["data"].pop("password", None)
    return res, 200
  else:
    return {}, 204

@app.route("/get_vote", methods=["POST"])
@jwt_required()
def get_queue_votes():
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  nim = request.json.get("nim")
  votes = db["votes"].find_one({"username" : nim})
  if votes:
    res = {
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "data" : votes
    }
    res["data"].pop("_id", None)
    return res, 200
  else:
    return {}, 204

@app.route("/get_users")
@jwt_required()
def get_users():
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  users = db["users"].find({})
  if users:
    res = {
      "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
      "data" : [x for x in users]
    }
    for p in res["data"]:
      p.pop("_id", None)
    return res, 200
  else:
    return {}, 204

@app.route("/toggle_voting", methods=["PUT"])
@jwt_required()
def toggle_voting():
  global isVoting
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  isVoting = not isVoting
  return {}, 202

@app.route("/get_paslon")
def get_paslon():
  paslon = db["paslon"].find({})
  if paslon:
    res = {
      "timestamp" : datetime.now(),
      "data" : [x for x in paslon] 
    }
    for p in res["data"]:
      p.pop("_id", None)
    return res, 200
  else:
    return {}, 204

@app.route("/status")
def get_status_votes():
  users = db["users"].find({})
  status_votes = {
    "Not Voted" : 0,
    "Voted" : 0,
    "In Progress" : 0,
    "Validated" : -1,
    "Rejected" : 0,
  }

  for user in users:
    temp = user
    if temp["isVoted"] == 0:
      status_votes["Not Voted"] += 1
    elif temp["isVoted"] == 1:
      status_votes["In Progress"] += 1
    elif temp["isVoted"] == 2:
      status_votes["Rejected"] += 1
    elif temp["isVoted"] == 3:
      status_votes["Rejected"] += 1
    elif temp["isVoted"] == 4:
      status_votes["Validated"] += 1
  return status_votes, 200


# Untuk Counting
isCounting = False # State counting
tempBPH = [True, True]
tempSenator = [True, True]
tempVote = [] # Seluruh data counting
tempTime = datetime.now()
tempTime2 = datetime.now()
tempCount = {
    "timestamp" : tempTime,
    "bph" : [0 for _ in range(3)],
    "senator" : [0 for _ in range(3)],
    "counted" : 0,
    "total" : len(tempVote)
  }


@app.route("/start_count", methods=["POST"])
@jwt_required()
def start_count():
  global isCounting, tempVote, tempTime
  identity = get_jwt_identity() 
  if identity != "admin":
    return {}, 401
  if not isCounting:
    isCounting = True
    tempVote = [x for x in db["votes"].find({"status" : 2})]
    tempTime = datetime.now()
    return {}, 200
  else:
    return {}, 400

@app.route("/stop_count", methods=["POST"])
@jwt_required()
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

def get_vote(arrVote, BPH):
  global tempBPH, tempSenator
  for paslon in arrVote:
    if paslon == -1:
      continue
    if BPH:
      if tempBPH[paslon]:
        return paslon
    else:
      if tempSenator[paslon]:
        return paslon
  return -1

def count(t, n):
  global tempCount
  tempCount = {
    "timestamp" : t.strftime("%d-%b-%Y (%H:%M:%S)"),
    "bph" : [0 for _ in range(2)],
    "senator" : [0 for _ in range(2)],
    "counted" : n,
    "total" : len(tempVote)
  }
  for vote in tempVote[:n]:
    x = get_vote(vote["bph_id"], True)
    if x >= 0:
      tempCount["bph"][x] += 1
    y = get_vote(vote["senator_id"], False)
    if y >= 0:
      tempCount["senator"][y] += 1
  return tempCount

@app.route("/get_count")
@jwt_required()
def get_count():
  global isCounting, tempVote, tempTime, tempCount
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  if isCounting:
    t = datetime.now()
    n = int(min(len(tempVote), (t - tempTime).total_seconds()//1)) # 5 nya waktu per vote terhintung
    if n == tempCount["counted"]:
      res = tempCount
    else:
      res = count(t, n)
    return res, 200
  else:
    return {}, 204

@app.route("/get_results")
def get_results():
  global tempCount, isFinished, tempVote
  if isFinished:
    t = datetime.now()
    res = count(t, len(tempVote))
    return res, 200
  else:
    return {}, 401


@app.route("/toggle_results", methods=["PUT"])
@jwt_required()
def toggle_results():
  global isFinished
  identity = get_jwt_identity()
  if identity != "admin":
    return {}, 401
  isFinished = not isFinished
  return {}, 202
  

if __name__ == "__main__":
  app.run(port=8000)