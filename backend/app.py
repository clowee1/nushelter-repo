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
    
    result = supabase.table("users").insert({
        "name": name,
        "email": email,
        "password": password
    }).execute()

    user = result.data[0]

    return {
        "message": "User registered successfully",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
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
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }

@app.route('/donate', methods=["POST"])
def donate():

    data = request.get_json()

    user_id = data["user_id"]
    colour = data["colour"]
    nickname = data["nickname"]

    last_umbrella = (supabase.table("umbrellas")
                    .select("umbrella_id")
                    .order("umbrella_id", desc = True)
                    .limit(1)
                    .execute()
    )

    if not last_umbrella.data:
        umbrella_id = 1
    else:
        umbrella_id = last_umbrella.data[0]["umbrella_id"] + 1
    
    umbrella_code = f"NUS-{umbrella_id:03d}"

    supabase.table("umbrellas").insert({
        "umbrella_id": umbrella_id,
        "umbrella_code": umbrella_code,
        "owner_id": user_id,
        "colour": colour,
        "nickname": nickname,
        "status": "Available",
        "borrowed_by": None 
    }).execute()

    return {
        "message": "Umbrella registered successfully",
        "umbrella": {
            "umbrella_id": umbrella_id,
            "umbrella_code": umbrella_code,
            "status": "Available",
            "borrowed_by": None
        }
    }

@app.route('/borrow', methods=["POST"])
def borrow():

    data = request.get_json()

    user_id = data["user_id"]
    umbrella_id = data["umbrella_id"]
 
    result = (
        supabase.table("umbrellas")
        .select("*")
        .eq("umbrella_id", umbrella_id)
        .execute()
    )

    if not result.data:
        return {
            "message": "Umbrella not found"
        }, 404
    
    umbrella = result.data[0]

    if umbrella["status"] == "Borrowed":
        return {
            "message": "Umbrella already borrowed"
        }, 400

    supabase.table("umbrellas").update({
        "status": "Borrowed",
        "borrowed_by": user_id
    }).eq(
        "umbrella_id",
        umbrella_id
    ).execute()

    return {
        "message": "Umbrella borrowed successfully",
        "umbrella": {
            "umbrella_id": umbrella_id,
            "status": "Borrowed",
            "borrowed_by": user_id
        }
    }

@app.route("/return", methods=["POST"])
def return_umbrella():

    data = request.get_json()

    umbrella_id = data["umbrella_id"]
    user_id = data["user_id"]


    result = (
        supabase.table("umbrellas")
        .select("*")
        .eq("umbrella_id", umbrella_id)
        .execute()
    )

    if not result.data:
        return {
            "message": "Umbrella not found"
        }, 404
    
    umbrella = result.data[0]

    if umbrella["status"] == "Available":
        return {
            "message": "Umbrella already available, cannot be returned"
        }, 400
    
    if umbrella["borrowed_by"] != user_id:
        return {
            "message": "You did not borrow this umbrella"
        }, 403
    
    supabase.table("umbrellas").update({
        "status": "Available",
        "borrowed_by": None
    }).eq(
        "umbrella_id",
        umbrella_id
    ).execute()

    return {
        "message": "Umbrella returned successfully",
        "umbrella": {
            "umbrella_id": umbrella_id,
            "status": "Available",
            "borrowed_by": None
        }
    } 

@app.route("/umbrellas")
def get_umbrellas():

    result = (
        supabase.table("umbrellas")
        .select("*")
        .eq("status", "Available")
        .execute()
    )

    return result.data


if __name__ == "__main__":
    app.run(debug=True)