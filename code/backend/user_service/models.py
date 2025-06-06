from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

# User model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    familyname = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')
    status = db.Column(db.String(50), nullable=False, default='pending')
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    approved_at = db.Column(db.DateTime)

    def __repr__(self):
        return f'<User {self.email}>'
