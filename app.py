from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from models import User, Recipe, Comment

# 블루프린트
from routes.auth import auth_bp
from routes.recipes import recipe_bp
from routes.comments import comment_bp
from routes.view import view_bp

def create_app():
    app = Flask(__name__, static_url_path='/static')
    app.config.from_object(Config)

    # CORS 허용
    CORS(app)

    # JWT 설정
    JWTManager(app)

    # DB 초기화
    db.init_app(app)

    with app.app_context():
        db.create_all()

    # 블루프린트 등록
    app.register_blueprint(auth_bp)
    app.register_blueprint(recipe_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(view_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
