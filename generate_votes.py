from pymongo import MongoClient
from random import shuffle
from datetime import datetime

N = 100
# MongoDB Stuff
cluster = MongoClient("mongodb+srv://vito:ZBv1zgjEjFtt9k7x@cluster0.epqqw.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = cluster["pilketang-gea"]
vote = [0,1]
for i in range(N):
  shuffle(vote)
  bph_id = vote.copy()
  shuffle(vote)
  senator_id = vote.copy()
  data = {
    "username" : i,
    "bph_id" :  bph_id,
    "senator_id" : senator_id,
    "timestamp" : datetime.now().strftime("%d-%b-%Y (%H:%M:%S)"),
    "img_url" : "no",
    "timeTaken" : 0,
    "status" : 2
  }
  db["votes"].insert_one(data)