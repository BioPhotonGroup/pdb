import os

# JWT secret key for signing tokens
SECRET_KEY = os.getenv('SECRET_KEY', 'ejB6DgpsmlOwhKFEJ3UQOMQe1hPzyujv')  # Replace with a strong key
# URL for the User Service
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user_service:5002')
