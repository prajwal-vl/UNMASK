from datetime import timedelta

from flask import Blueprint, request
from flask_jwt_extended import create_access_token

from ..utils.db import get_db
from ..utils.security import check_password, hash_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload = request.get_json() or {}
    name = payload.get("name", "").strip()
    email = payload.get("email", "").lower().strip()
    password = payload.get("password", "")

    if not name or not email or len(password) < 6:
        return {"error": "Invalid input"}, 400

    db = get_db()
    if db.users.find_one({"email": email}):
        return {"error": "Email already in use"}, 409

    user = {
        "name": name,
        "email": email,
        "password": hash_password(password),
    }
    inserted = db.users.insert_one(user)

    token = create_access_token(identity=str(inserted.inserted_id), expires_delta=timedelta(days=1))
    return {"token": token, "user": {"id": str(inserted.inserted_id), "name": name, "email": email}}, 201


@auth_bp.post("/login")
def login():
    payload = request.get_json() or {}
    email = payload.get("email", "").lower().strip()
    password = payload.get("password", "")

    db = get_db()
    user = db.users.find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return {"error": "Invalid credentials"}, 401

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=1))
    return {
        "token": token,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]},
    }, 200
