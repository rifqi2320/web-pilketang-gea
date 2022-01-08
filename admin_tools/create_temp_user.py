from pymongo import MongoClient

def createUser(db, nama):
  data_user = db["users"]
  data_user.insert_one(
    {
      'username' : nama,
      'password' : "password",
      'isVoted' : 0,
      'type' : 'user',
      'startTime' : 0
    }
  )

cluster = MongoClient("mongodb+srv://vito:ZBv1zgjEjFtt9k7x@cluster0.epqqw.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = cluster["pilketang-gea"]
for i in range(10):
  createUser(db, "user" + str(i))