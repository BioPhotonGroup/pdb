import jwt
from flask import request
from config import IDENTITY_SERVICE_URL
import requests

# Verify token by making a request to the Identity Service
def verify_token():
    token = request.headers.get('Authorization')
    if not token:
        return None, {"message": "Token is missing"}, 401

    # Make a request to the Identity Service to verify the token
    response = requests.get(f'{IDENTITY_SERVICE_URL}/api/v1/identity/verify_token', headers={'Authorization': token})
    if response.status_code == 200:
        return response.json(), None, None
    else:
        return None, {"message": "Invalid or expired token"}, 401

# Error handler for access denied
def access_denied_error(role):
    return {"message": f"Access denied. Requires {role} role."}, 403

# Error handler for missing token
def token_missing_error():
    return {"message": "Token is missing"}, 401
