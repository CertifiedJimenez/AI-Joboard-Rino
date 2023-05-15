# app/__init__.py

from flask import Flask
from .config import Config
from .models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Import routes at the end to avoid circular imports
    from app import routes
    app.register_blueprint(routes.bp)

    return app
