from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Recipe, User
from database import db
import os
from werkzeug.utils import secure_filename
import uuid

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

# 이미지 저장 폴더 설정
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 레시피 등록
@recipe_bp.route("/recipes", methods=["POST"])
@jwt_required()
def create_recipe():
    title = request.form.get("title")
    description = request.form.get("description")
    steps_json = request.form.get("steps")

    current_user_id = get_jwt_identity()

    image_urls = []
    for key in request.files:
        file = request.files[key]
        if file:
            filename = secure_filename(file.filename)
            ext = filename.rsplit('.', 1)[-1]
            unique_filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(filepath)
            image_urls.append(f"/{UPLOAD_FOLDER}/{unique_filename}")

    new_recipe = Recipe(
        title=title,
        description=description,
        user_id=current_user_id
    )
    db.session.add(new_recipe)
    db.session.commit()

    return jsonify({
        "message": "Recipe created",
        "images": image_urls
    }), 201

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
