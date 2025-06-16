from flask import Blueprint, send_from_directory, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from database import db
import os

view_bp = Blueprint("view", __name__)

FRONTEND_DIR = os.path.abspath("recipe-frontend")

@view_bp.route("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "login.html")

@view_bp.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)

@view_bp.route("/register.html")
def serve_register():
    return send_from_directory("recipe-frontend", "register.html")

@view_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "bio": user.bio or ""
    })

@view_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_bio():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    user.bio = data.get("bio", "")
    db.session.commit()
    return jsonify({"message": "Bio updated"})

