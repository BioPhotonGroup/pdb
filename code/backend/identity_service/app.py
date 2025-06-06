from flask import Flask, request, jsonify
import requests
from utils import generate_token, token_required
from waitress import serve

app = Flask(__name__)

# User Service URL
USER_SERVICE_URL = 'http://user_service:5002'

# Route for user login - authenticate and return JWT token
@app.route('/api/v1/identity/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Request the User Service to validate the user's credentials
    response = requests.post(f'{USER_SERVICE_URL}/verify_user', json={'email': email, 'password': password})
    
    if response.status_code == 200:
        user = response.json()
        token = generate_token(user)  # Generate JWT token
        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Route to verify JWT token - accessible to any logged-in user
@app.route('/api/v1/identity/verify_token', methods=['GET'])
@token_required
def verify_token(decoded_token):
    return jsonify(decoded_token), 200

# Example of a protected route for admin users only
@app.route('/api/v1/admin/data', methods=['GET'])
@token_required
def get_admin_data(decoded_token):
    if decoded_token['role'] != 'admin':
        return jsonify({"message": "Access denied: Admins only"}), 403
    
    return jsonify({"message": "Welcome, Admin"}), 200

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5001)
