from hashlib import sha1
from pymongo import MongoClient

def createUser(db, nim):
  data_user = db["users"]
  data_user.insert_one(
    {
      'username' : nim,
      'password' : nim + '_' + sha1(nim.encode()).hexdigest()[:16],
      'isVoted' : 0,
      'type' : 'user'
    }
  )

cluster = MongoClient("mongodb+srv://vito:ZBv1zgjEjFtt9k7x@cluster0.epqqw.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = cluster["pilketang-gea"]
data_user = db["users"]
data_user.delete_many({})
db["votes"].delete_many({})
data_user.insert_one({
    "username" : "admin",
    "password" : "admin_" + sha1("admin".encode()).hexdigest()[:16],
    "isVoted" : 3,
    "type" : "admin"
  })
for i in range(68):
  nim = str(12020001 + i)
  createUser(db, nim)