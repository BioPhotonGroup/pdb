import jwt
from datetime import datetime, timedelta
from flask import request, jsonify
from config import SECRET_KEY

# Generate a JWT token
def generate_token(user):
    payload = {
        "id": user['id'],
        "username": user['email'],
        "role": user['role'],
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Decode and verify a JWT token
def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

# Check token and verify the role
def token_required(f):
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing"}), 401

        decoded_token = decode_token(token)
        if not decoded_token:
            return jsonify({"message": "Invalid or expired token"}), 401

        return f(decoded_token, *args, **kwargs)
    decorator.__name__ = f.__name__
    return decorator
