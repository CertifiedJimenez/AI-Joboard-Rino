# app/__init__.py

from flask import Flask
from .config import Config
from .models import db
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app) 
    app.config.from_object(Config)
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Import routes at the end to avoid circular imports
    from app import routes
    app.register_blueprint(routes.bp)

    return app
