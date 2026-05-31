from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client

app = Flask(__name__)
CORS(app)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

@app.route("/test-db")
def test_db():

    result = supabase.table("users").select("*").execute()

    return result.data

@app.route("/")
def home():
    return {
        "message" : "NUShelter backend running"
    }

@app.route("/register", methods=["POST"])
def register():

    print("Register route called")

    data = request.get_json()
    print(data)

    name = data["name"]
    email = data["email"]
    password = data["password"]

    existing_user = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if existing_user.data:
        return {
            "message": "Email already exists"
        }, 400
    
    supabase.table("users").insert({
        "name": name,
        "email": email,
        "password": password
    }).execute()


    return {
        "message": "User registered successfully"
    }

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    result = (supabase.table("users")
                     .select("*")
                     .eq("email", email)
                     .execute()
    )

    if not result.data:
        return {
            "message": "User not found"
        }, 404
    
    user = result.data[0]

    if user["password"] != password:
        return {
            "message": "Incorrect password"
        }, 401
    return {
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }


if __name__ == "__main__":
    app.run(debug=True)