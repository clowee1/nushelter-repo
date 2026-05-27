import json
from pathlib import Path
from uuid import uuid4

from werkzeug.security import check_password_hash, generate_password_hash

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "users.json"


def _ensure_data_file():
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")


def _load_users():
    _ensure_data_file()
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _save_users(users):
    _ensure_data_file()
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(users, file, indent=2)


def find_user_by_email(email):
    users = _load_users()
    return next((user for user in users if user["email"] == email), None)


def create_user(name, email, password):
    users = _load_users()
    user = {
        "id": str(uuid4()),
        "name": name,
        "email": email,
        "passwordHash": generate_password_hash(password)
    }
    users.append(user)
    _save_users(users)
    return user


def verify_user_password(user, password):
    return check_password_hash(user["passwordHash"], password)
