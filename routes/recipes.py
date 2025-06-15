from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Recipe, User
from database import db

recipe_bp = Blueprint("recipes", __name__)

# 모든 레시피 조회
@recipe_bp.route("/recipes", methods=["GET"])
@jwt_required()
def get_all_recipes():
    recipes = Recipe.query.order_by(Recipe.created_at.desc()).all()
    data = [{
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "user_id": r.user.id,
        "username": r.user.username
    } for r in recipes]
    return jsonify({"success": True, "data": data})

# 레시피 등록 (중복 제거됨)
@recipe_bp.route("/recipes", methods=["POST"])
@jwt_required()
def add_recipe():
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")

    if not title or not description:
        return jsonify({"success": False, "message": "Missing title or description"}), 400

    recipe = Recipe(title=title, description=description, user_id=user_id)
    db.session.add(recipe)
    db.session.commit()

    return jsonify({"success": True, "message": "Recipe added!"}), 201

# 레시피 수정
@recipe_bp.route("/recipes/<int:id>", methods=["PUT"])
@jwt_required()
def edit_recipe(id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.get_or_404(id)

    if recipe.user_id != user_id:
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    data = request.get_json()
    recipe.title = data.get("title", recipe.title)
    recipe.description = data.get("description", recipe.description)
    db.session.commit()

    return jsonify({"success": True, "message": "Recipe updated"})

# 레시피 삭제
@recipe_bp.route("/recipes/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.get_or_404(id)

    if recipe.user_id != user_id:
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"success": True, "message": "Recipe deleted"})
