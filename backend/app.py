from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users = []

@app.route("/")
def home():
    return {
        "message" : "NUShelter backend running"
    }

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data["name"]
    email = data["email"]
    password = data["password"]

    new_user = {
        "name" : name,
        "email" : email,
        "password" : password
    }
    
    users.append(new_user)

    return {
        "message": "User registered successfully",
        "user": new_user
    }

@app.route("/login", methods=["POST"])
def logIn():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    for user in users:
        if user["email"] == email:
            if user["password"] == password:
                return {
                    "message": "Successful user login",
                    "user": {
                        "name": user["name"],
                        "email": user["email"]
                    }
                }
            else:
                return {
                    "message": "Incorrect password"
                }, 401 
        return {
        "message": "User not found"
    }, 404
    

if __name__ == "__main__":
    app.run(debug=True)