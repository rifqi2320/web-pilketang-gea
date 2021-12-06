import firebase_admin
from firebase_admin import credentials, firestore
from hashlib import sha1

cred = credentials.Certificate('venv/firebase_credentials.json')

firebase_admin.initialize_app(cred)

db = firestore.client()
data_user = db.collection('users')
for i in range(68):
  nim = str(12020001 + i)
  data_user.document(nim).set(
    {
      'username' : nim,
      'password' : nim + '_' + sha1(nim.encode()).hexdigest()[:16],
      'isVoted' : 0,
      'type' : 'user'
    }
  )