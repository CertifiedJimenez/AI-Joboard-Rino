from flask_sqlalchemy import SQLAlchemy
from  datetime import datetime

db = SQLAlchemy()

class Jobs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(50), nullable=False)
    company = db.Column(db.String(80), nullable=False)
    url = db.Column(db.String(2048), nullable=False)
    source = db.Column(db.String(80), nullable=False)
    job_type = db.Column(db.String(50))
    salary_min = db.Column(db.Float)
    salary_max = db.Column(db.Float)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    skills = db.Column(db.JSON)

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(80), nullable=False)
    logo = db.Column(db.JSON)
