import os

# Service URLs
IDENTITY_SERVICE_URL = os.getenv('IDENTITY_SERVICE_URL', 'http://identity_service:5001')
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user_service:5002')
DATASET_SERVICE_URL = os.getenv('DATASET_SERVICE_URL', 'http://dataset_service:5003')
METADATA_SERVICE_URL = os.getenv('METADATA_SERVICE_URL', 'http://metadata_service:5004')
