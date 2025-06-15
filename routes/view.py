from flask import Blueprint, send_from_directory
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

