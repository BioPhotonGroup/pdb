from flask import Flask, request, jsonify
from waitress import serve
import requests
import logging
from role_required import RoleRequiredDecorator
from roles import Roles
from config import DATASET_SERVICE_URL, IDENTITY_SERVICE_URL, USER_SERVICE_URL, METADATA_SERVICE_URL

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# -----------------------------------
# Health Check Route
# -----------------------------------
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK"}), 200

# -----------------------------------
# Identity Service - Authentication
# -----------------------------------
@app.route('/api/v1/identity/login', methods=['POST'])
def login():
    logging.info("Login request received")
    data = request.get_json()
    response = requests.post(f'{IDENTITY_SERVICE_URL}/api/v1/identity/login', json=data)
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/identity/verify_token', methods=['GET'])
def verify_token_route():
    logging.info("Verify token request received")
    user, error, status = verify_token()
    if error:
        return jsonify(error), status
    return jsonify(user), 200

# -----------------------------------
# Dataset Service - Dataset Management
# -----------------------------------
@app.route('/api/v1/dataset', methods=['POST'])
@RoleRequiredDecorator(Roles.USER)
def create_dataset():
    logging.info("Create dataset request received")
    data = request.get_json()
    response = requests.post(f'{DATASET_SERVICE_URL}/api/v1/dataset', json=data)
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/dataset', methods=['GET'])
@RoleRequiredDecorator(Roles.USER)
def get_datasets():
    logging.info("Get datasets request received")
    response = requests.get(f'{DATASET_SERVICE_URL}/api/v1/dataset')
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/dataset/<dataset_id>', methods=['GET'])
@RoleRequiredDecorator(Roles.USER)
def get_dataset(dataset_id):
    logging.info(f"Get dataset {dataset_id} request received")
    response = requests.get(f'{DATASET_SERVICE_URL}/api/v1/dataset/{dataset_id}')
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/dataset/<dataset_id>/approve', methods=['PUT'])
@RoleRequiredDecorator(Roles.ADMIN)
def approve_dataset(dataset_id):
    logging.info(f"Approve dataset {dataset_id} request received")
    response = requests.put(f'{DATASET_SERVICE_URL}/api/v1/dataset/{dataset_id}/approve')
    return jsonify(response.json()), response.status_code

# -----------------------------------
# Dataset Service - Keywords Management
# -----------------------------------
@app.route('/api/v1/keywords', methods=['GET'])
@RoleRequiredDecorator(Roles.USER)
def get_keywords():
    logging.info("Get keywords request received")
    response = requests.get(f'{DATASET_SERVICE_URL}/api/v1/keywords')
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/keywords', methods=['POST'])
@RoleRequiredDecorator(Roles.USER)
def add_keyword():
    logging.info("Add keyword request received")
    data = request.get_json()
    response = requests.post(f'{DATASET_SERVICE_URL}/api/v1/keywords', json=data)
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/dataset/<dataset_id>/keywords', methods=['POST'])
@RoleRequiredDecorator(Roles.USER)
def add_keywords_to_dataset(dataset_id):
    logging.info(f"Add keywords to dataset {dataset_id} request received")
    data = request.get_json()
    response = requests.post(f'{DATASET_SERVICE_URL}/api/v1/dataset/{dataset_id}/keywords', json=data)
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/dataset/<dataset_id>/keywords', methods=['GET'])
@RoleRequiredDecorator(Roles.USER)
def get_keywords_for_dataset(dataset_id):
    logging.info(f"Get keywords for dataset {dataset_id} request received")
    response = requests.get(f'{DATASET_SERVICE_URL}/api/v1/dataset/{dataset_id}/keywords')
    return jsonify(response.json()), response.status_code

# -----------------------------------
# Dataset Service - Measurement Techniques Management
# -----------------------------------
@app.route('/api/v1/measurement_techniques', methods=['GET'])
@RoleRequiredDecorator(Roles.USER)
def get_measurement_techniques():
    logging.info("Get measurement techniques request received")
    response = requests.get(f'{DATASET_SERVICE_URL}/api/v1/measurement_techniques')
    return jsonify(response.json()), response.status_code

@app.route('/api/v1/measurement_techniques', methods=['POST'])
@RoleRequiredDecorator(Roles.USER)
def add_measurement_technique():
    logging.info("Add measurement technique request received")
    data = request.get_json()
    response = requests.post(f'{DATASET_SERVICE_URL}/api/v1/measurement_techniques', json=data)
    return jsonify(response.json()), response.status_code

# -----------------------------------
# User Service - User Management
# -----------------------------------

# Create a new user
@app.route('/api/v1/users', methods=['POST'])
def create_user():
    logging.info("Create user request received")
    data = request.get_json()
    response = requests.post(f'{USER_SERVICE_URL}/api/v1/users', json=data)
    return jsonify(response.json()), response.status_code

# Get all users (Admin only)
@app.route('/api/v1/users', methods=['GET'])
@RoleRequiredDecorator(Roles.ADMIN)
def get_all_users():
    logging.info("Get all users request received")
    response = requests.get(f'{USER_SERVICE_URL}/api/v1/users')
    return jsonify(response.json()), response.status_code

# Get user by ID
@app.route('/api/v1/users/<user_id>', methods=['GET'])
@RoleRequiredDecorator(Roles.ADMIN)
def get_user(user_id):
    logging.info(f"Get user {user_id} request received")
    response = requests.get(f'{USER_SERVICE_URL}/api/v1/users/{user_id}')
    return jsonify(response.json()), response.status_code

# Update user role (Admin only)
@app.route('/api/v1/users/<user_id>/role', methods=['PUT'])
@RoleRequiredDecorator(Roles.ADMIN)
def update_user_role(user_id):
    logging.info(f"Update role for user {user_id} request received")
    data = request.get_json()
    response = requests.put(f'{USER_SERVICE_URL}/api/v1/users/{user_id}/role', json=data)
    return jsonify(response.json()), response.status_code

# Update user password (Admin only)
@app.route('/api/v1/users/<user_id>/password', methods=['PUT'])
@RoleRequiredDecorator(Roles.ADMIN)
def update_user_password(user_id):
    logging.info(f"Update password for user {user_id} request received")
    data = request.get_json()
    response = requests.put(f'{USER_SERVICE_URL}/api/v1/users/{user_id}/password', json=data)
    return jsonify(response.json()), response.status_code

# -----------------------------------
# Metadata Service - DOI Metadata Fetching
# -----------------------------------

@app.route('/api/v1/metadata/<doi>', methods=['GET'])
@RoleRequiredDecorator(Roles.USER)
def get_doi_metadata(doi):
    logging.info(f"Get DOI metadata for {doi} request received")
    response = requests.get(f'{METADATA_SERVICE_URL}/api/v1/metadata/{doi}')
    return jsonify(response.json()), response.status_code

# -----------------------------------
# Application Start
# -----------------------------------
if __name__ == '__main__':
    logging.info("Starting API Gateway...")
    serve(app, host='0.0.0.0', port=5000)
