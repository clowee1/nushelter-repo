from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase_client import supabase
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from recommendation import get_top_recommendations

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

jwt = JWTManager(app)

CORS(app)

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
    
    if len(email) == 0:
        return {
            "message": "Please enter your email"
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
        "is_suspended": False
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
        identity = str(user["user_id"])
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

@app.route("/stations")
def get_stations():
    result = supabase.table("stations").select("*").execute()
    return result.data

@app.route('/donate', methods=["POST"])
@jwt_required()
def donate():

    data = request.get_json()

    user_id = int(get_jwt_identity())
    colour = data["colour"]
    nickname = data["nickname"]
    condition = data["condition"]
    location_id = data["location_id"]

    station = (supabase.table("stations")
               .select("current_count, capacity")
                .eq("station_id", location_id)
                .execute().data[0])

    if station["current_count"] >= station["capacity"]:
        return {"error": "Station is full"}, 400

    result = supabase.table("umbrellas").insert({
        "owner_id": user_id,
        "colour": colour,
        "nickname": nickname,
        "status": "Available",
        "borrowed_by": None,
        "condition": condition,
        "location_id" : location_id
    }).execute()

    umbrella = result.data[0]

    umbrella_id = umbrella["umbrella_id"]
    umbrella_code = f"NUS-{umbrella_id:03d}"

    supabase.table("umbrellas").update({
        "umbrella_code": umbrella_code
    }).eq(
        "umbrella_id", umbrella_id
    ).execute()

    station = (supabase.table("stations")
               .select("current_count")
               .eq("station_id", location_id)
               .execute().data[0])
    
    supabase.table("stations").update({
        "current_count": station["current_count"] + 1
    }).eq("station_id", location_id).execute()

    
    return {
        "message": "Umbrella registered successfully",
        "umbrella": {
            "umbrella_id": umbrella_id,
            "umbrella_code": umbrella_code,
        }
    }

@app.route('/borrow', methods=["POST"])
@jwt_required()
def borrow():

    data = request.get_json()

    user_id = int(get_jwt_identity())
    umbrella_id = data["umbrella_id"]
    
    if has_overdue_umbrella(user_id):

        supabase.table("users").update({
            "is_suspended": True
        }).eq(
            "user_id",
            user_id
        ).execute()

        return {
            "message": "Account suspended due to overdue umbrella."
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
        "borrowed_by": user_id,
        "location_id": None
    }).eq(
        "umbrella_id",
        umbrella_id
    ).execute()

    due_at = (
        datetime.now(timezone.utc)
        + timedelta(hours=48)
    ).isoformat()

    supabase.table("borrow_logs").insert({
        "umbrella_id": umbrella_id,
        "borrower_id": user_id,
        "due_at": due_at,
        "status": "Active"
    }).execute()

    if umbrella["location_id"]:
        station = (supabase.table("stations")
                   .select("current_count")
                   .eq("station_id", umbrella["location_id"])
                   .execute().data[0])

        supabase.table("stations").update({
            "current_count": max(0, station["current_count"] - 1)
        }).eq("station_id", umbrella["location_id"]).execute()

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
    location_id = data["location_id"]
    umbrella_id = data["umbrella_id"]
    user_id = int(get_jwt_identity())

    active_log = (
        supabase.table("borrow_logs")
        .select("*")
        .eq("umbrella_id", umbrella_id)
        .eq("borrower_id", user_id)
        .eq("status", "Active")
        .execute()
    )

    if active_log.data:
        log = active_log.data[0]
    else:
        return {
            "message": "Active borrow log not found"
        }, 404

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
    
    station = (supabase.table("stations")
               .select("current_count, capacity")
               .eq("station_id", location_id)
               .execute().data[0])

    if station["current_count"] >= station["capacity"]:
        return {"error": "Station is full, please choose another"}, 400
    
    supabase.table("umbrellas").update({
        "status": "Available",
        "borrowed_by": None,
        "location_id": location_id
    }).eq(
        "umbrella_id",
        umbrella_id
    ).execute()

    supabase.table("borrow_logs").update({
        "returned_at": datetime.now(timezone.utc).isoformat(),
        "status": "Returned"
    }).eq(
        "borrow_id",
        log["borrow_id"]
    ).execute()

    supabase.table("users").update({
        "is_suspended": False
    }).eq(
        "user_id",
        user_id
    ).execute()

    supabase.table("stations").update({
        "current_count": station["current_count"] + 1
    }).eq("station_id", location_id).execute()

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


def has_overdue_umbrella(user_id):

    active_logs = (
        supabase.table("borrow_logs")
        .select("*")
        .eq("borrower_id", user_id)
        .eq("status", "Active")
        .execute()
    )

    now = datetime.now(timezone.utc)

    for log in active_logs.data:

        due_at = datetime.fromisoformat(
            log["due_at"].replace("Z", "+00:00")
        )

        if now > due_at:
            return True

    return False


@app.route("/my_borrows")
@jwt_required()
def my_borrows():

    user_id = int(get_jwt_identity())

    result = (
        supabase.table("borrow_logs")
        .select("*")
        .eq("borrower_id", user_id)
        .order("borrowed_at", desc=True)
        .execute()
    )

    return result.data

@app.route("/profile")
@jwt_required()
def profile():
    
    user_id = int(get_jwt_identity())

    user = (
        supabase.table("users")
        .select("user_id, name, email")
        .eq("user_id", user_id)
        .execute().data[0]
    )

    donated = (
        supabase.table("umbrellas")
        .select("*")
        .eq("owner_id", user_id)
        .execute()
    )

    borrowed = (
        supabase.table("borrow_logs")
        .select("*")
        .eq("borrower_id", user_id)
        .execute()
    )

    return {
        "user": user,
        "stats": {
            "donated": len(donated.data),
            "borrowed": len(borrowed.data)
        }
    }

@app.route('/thank_you_note', methods=["POST"])
@jwt_required()
def note():

    sender_id = int(get_jwt_identity())

    data = request.get_json()
    umbrella_id = data["umbrella_id"]
    message = data["message"]

    borrow_log = (supabase.table("borrow_logs")
                  .select("*")
                  .eq("umbrella_id", umbrella_id)
                  .eq("borrower_id", sender_id)
                  .execute())

    if not borrow_log.data:
        return {"error": "You have not borrowed this umbrella"}, 403

    umbrella = (supabase.table("umbrellas")
                   .select("owner_id")
                   .eq("umbrella_id", umbrella_id)
                   .execute().data[0])

    receiver_id = umbrella["owner_id"]

    supabase.table("thank_you_notes").insert({
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "umbrella_id": umbrella_id,
        "message": message
    }).execute()

    return {"message": "Thank you note sent!"}

@app.route('/my_notes')
@jwt_required()
def my_notes():

    user_id = int(get_jwt_identity())

    notes = (
        supabase.table("thank_you_notes")
        .select("*")
        .eq("receiver_id", user_id)
        .order("created_at", desc = True)
        .execute()
    )

    return notes.data 

@app.route("/recommended-drop-off", methods=["GET"])
@jwt_required()
def recommend_dropoff():
    user_lat = request.args.get("lat", type=float)
    user_lon = request.args.get("lon", type=float)
    
    if user_lat is None or user_lon is None:
        return {"error": "lat and lon query params are required"}, 400

    recommendations = get_top_recommendations(user_lat, user_lon)
    return {"recommendations": recommendations}

if __name__ == "__main__":
    app.run(debug=True)
