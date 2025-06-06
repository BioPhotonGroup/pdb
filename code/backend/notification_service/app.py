from flask import Flask, request, jsonify
import requests
import pika
import json
from config import RABBITMQ_URL, RABBITMQ_QUEUE, USER_SERVICE_URL


app = Flask(__name__)

# Function to send message to RabbitMQ
def send_to_rabbitmq(message):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE)
    channel.basic_publish(exchange='', routing_key=RABBITMQ_QUEUE, body=json.dumps(message))
    connection.close()

# Route to create notification
@app.route('/api/v1/notifications', methods=['POST'])
def create_notification():
    data = request.get_json()

    # Check if user_email is provided
    if not data.get('user_email'):
        # Query User Service to get the user email
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"message": "user_id or user_email is required"}), 400

        user_response = requests.get(f"{USER_SERVICE_URL}/api/v1/users/{user_id}")
        if user_response.status_code != 200:
            return jsonify({"message": "Failed to get user email"}), 400
        
        user_data = user_response.json()
        data['user_email'] = user_data.get('email')

    # Send message to RabbitMQ
    message = {
        'to_email': data['user_email'],
        'subject': data['subject'],
        'body': data['body']
    }
    send_to_rabbitmq(message)

    return jsonify({"message": "Notification sent to RabbitMQ"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
