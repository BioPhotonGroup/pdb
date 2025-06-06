from flask import Flask, request, jsonify
import requests
from rabbitmq_handler import send_to_rabbitmq
from config import USER_SERVICE_URL
from waitress import serve

app = Flask(__name__)

# Helper function to fetch user email from the User Service
def get_user_email(user_id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{user_id}")
        if response.status_code == 200:
            user_data = response.json()
            return user_data.get('email')
        else:
            return None
    except Exception as e:
        print(f"Failed to fetch user email: {str(e)}")
        return None

# Route to create a notification
@app.route('/api/v1/notifications', methods=['POST'])
def create_notification():
    data = request.get_json()

    # Validate the request payload
    if not data.get('subject') or not data.get('body'):
        return jsonify({"message": "subject and body are required"}), 400

    # If user_email is not provided, fetch it using user_id
    if not data.get('user_email'):
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"message": "user_id or user_email is required"}), 400

        user_email = get_user_email(user_id)
        if not user_email:
            return jsonify({"message": "Failed to fetch user email"}), 400

        data['user_email'] = user_email

    # Send message to RabbitMQ
    send_to_rabbitmq(data)

    return jsonify({"message": "Notification sent to RabbitMQ"}), 200

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5005)
