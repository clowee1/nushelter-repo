from flask import Blueprint, jsonify, request

from services.user_store import create_user, find_user_by_email, verify_user_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/")
def home():
    return {
        "message": "NUShelter backend running"
    }


@auth_bp.route("/api/existing-user", methods=["POST"])
def existing_user():
    payload = request.get_json(silent=True) or {}
    is_existing_user = payload.get("isExistingUser")

    if not isinstance(is_existing_user, bool):
        return jsonify({
            "error": "Request body must include boolean field 'isExistingUser'."
        }), 400

    redirect_to = "/login" if is_existing_user else "/register"

    return jsonify({
        "message": "Next route resolved successfully.",
        "isExistingUser": is_existing_user,
        "redirectTo": redirect_to
    })


@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not name or not email or not password:
        return jsonify({
            "error": "Fields 'name', 'email', and 'password' are required."
        }), 400

    if find_user_by_email(email):
        return jsonify({
            "error": "An account with this email already exists."
        }), 409

    user = create_user(name=name, email=email, password=password)

    return jsonify({
        "message": "Registration successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }), 201


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({
            "error": "Fields 'email' and 'password' are required."
        }), 400

    user = find_user_by_email(email)

    if not user or not verify_user_password(user, password):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    })
