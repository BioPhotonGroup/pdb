from flask import Flask, request, jsonify
from models import db, User
from utils import hash_password, verify_password
from config import SQLALCHEMY_DATABASE_URI
from waitress import serve

app = Flask(__name__)

# Load configuration
app.config.from_object('config')

# Initialize SQLAlchemy
db.init_app(app)

# Create tables if they don't exist (useful for first-time setup)
with app.app_context():
    db.create_all()

# Verify user credentials (for Identity Service)
@app.route('/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and verify_password(password, user.password_hash):
        return jsonify({"id": user.id, "email": user.email, "role": user.role}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Create a new user
@app.route('/api/v1/users', methods=['POST'])
def create_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    firstname = data.get('firstname')
    familyname = data.get('familyname')
    role =  'user'  # Default role is "user"
    status = 'pending'  # Default status is "pending"

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User with this email already exists"}), 400

    password_hash = hash_password(password)
    new_user = User(email=email, firstname=firstname, familyname=familyname, password_hash=password_hash, role=role, status=status)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created", "id": new_user.id}), 201

# Get all users (Admin-only)
@app.route('/api/v1/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    result = [
        {
            "id": user.id,
            "email": user.email,
            "firstname": user.firstname,
            "familyname": user.familyname,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at
        }
        for user in users
    ]
    return jsonify(result), 200

# Get user by ID
@app.route('/api/v1/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    result = {
        "id": user.id,
        "email": user.email,
        "firstname": user.firstname,
        "familyname": user.familyname,
        "role": user.role,
        "status": user.status,
        "created_at": user.created_at
    }
    return jsonify(result), 200

# Update user role (Admin only)
@app.route('/api/v1/users/<user_id>/role', methods=['PUT'])
def update_user_role(user_id):
    data = request.get_json()
    new_role = data.get('role')

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.role = new_role
    db.session.commit()

    return jsonify({"message": f"User {user_id} role updated to {new_role}"}), 200

# Update user password (Admin only)
@app.route('/api/v1/users/<user_id>/password', methods=['PUT'])
def update_user_password(user_id):
    data = request.get_json()
    new_password = data.get('password')

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.password_hash = hash_password(new_password)
    db.session.commit()

    return jsonify({"message": f"User {user_id} password updated"}), 200

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5002)
