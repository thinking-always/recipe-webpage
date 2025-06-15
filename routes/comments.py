from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Comment, Recipe
from database import db

comment_bp = Blueprint("comments", __name__)

@comment_bp.route("/comments", methods=["POST"])
@jwt_required()
def add_comment():
    user_id = get_jwt_identity()
    data = request.get_json()
    recipe_id = data.get("recipe_id")
    text = data.get("text")

    if not recipe_id or not text:
        return jsonify({"success": False, "message": "Missing recipe_id or text"}), 400

    comment = Comment(user_id=user_id, recipe_id=recipe_id, text=text)
    db.session.add(comment)
    db.session.commit()
    return jsonify({"success": True, "message": "Comment added"})

@comment_bp.route("/comments/<int:recipe_id>", methods=["GET"])
@jwt_required()
def get_comments(recipe_id):
    comments = Comment.query.filter_by(recipe_id=recipe_id).order_by(Comment.created_at.desc()).all()
    data = [{
        "id": c.id,
        "text": c.text,
        "user_id": c.user_id,
        "username": c.user.username,
        "created_at": c.created_at.isoformat()
    } for c in comments]
    return jsonify({"success": True, "data": data})
