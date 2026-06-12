from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

CORS(app)

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

    data = request.get_json()

    name = data["name"]
    email = data["email"]
    password = data["password"]

    if len(password) < 8:
        return {
            "message": "Password must be at least 8 characters"
        }, 400
    
    if not email.endswith("@u.nus.edu"):
        return {
            "message": "Only NUS students may register"
        }, 400
    
    if len(name) == 0:
        return {
            "message": "Please enter your name"
        }, 400
    
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
    
    hashed_password = generate_password_hash(password)

    result = supabase.table("users").insert({
        "name": name,
        "email": email,
        "password_hashed": hashed_password,
        "is_suspended": FALSE
    }).execute()

    user = result.data[0]

    return {
        "message": "User registered successfully",
        "user": {
            "user_id": user["user_id"],
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
                     .select("user_id, name, email, password_hashed")
                     .eq("email", email)
                     .execute()
    )

    if not result.data:
        return {
            "message": "User not found"
        }, 404
    
    user = result.data[0]

    if not check_password_hash(
        user["password_hashed"],
        password
    ):
        return {
            "message": "Incorrect password"
        }, 401
    
    access_token = create_access_token(
        identity = user["user_id"]
    )

    return {
        "message": "Login successful",
        "token": access_token,
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"]
        }
    }

@app.route('/donate', methods=["POST"])
@jwt_required()
def donate():

    data = request.get_json()

    user_id = get_jwt_identity()
    colour = data["colour"]
    nickname = data["nickname"]

    last_umbrella = (supabase.table("umbrellas")
                    .select("umbrella_id")
                    .order("umbrella_id", desc = True)
                    .limit(1)
                    .execute()
    )

    result = supabase.table("umbrellas").insert({
        "owner_id": user_id,
        "colour": colour,
        "nickname": nickname,
        "status": "Available",
        "borrowed_by": None
    }).execute()

    umbrella = result.data[0]

    umbrella_id = umbrella["umbrella_id"]
    umbrella_code = f"NUS-{umbrella_id:03d}"

    supabase.table("umbrellas").update({
        "umbrella_code": umbrella_code
    }).eq(
        "umbrella_id", umbrella_id
    ).execute()
    
    return {
        "message": "Umbrella registered successfully",
        "umbrella": {
            "umbrella_id": umbrella_id,
            "umbrella_code": umbrella_code,
        }
    }

@app.route('/location', methods=["POST"])
@jwt_required
def place_umbrella():

    data = request.get_json()

    umbrella_id = data["umbrella_id"]


@app.route('/borrow', methods=["POST"])
@jwt_required()
def borrow():

    data = request.get_json()

    user_id = get_jwt_identity()
    umbrella_id = data["umbrella_id"]

    suspended_accounts = (
        supabase.table("users")
        .select("is_suspended")
        .eq("user_id", user_id)
        .execute()
    )

    user = suspended_accounts.data[0]
    if user["is_suspended"]:
        return {
            "message": "Account suspended. Please return overdue umbrellas to continue borrowing."
        }, 403
 
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
@jwt_required()
def return_umbrella():

    data = request.get_json()

    umbrella_id = data["umbrella_id"]
    user_id = get_jwt_identity()


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