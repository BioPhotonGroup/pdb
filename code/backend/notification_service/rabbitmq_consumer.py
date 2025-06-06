import pika
import json
from config import RABBITMQ_URL, RABBITMQ_QUEUE
from email_sender import send_email

# Function to process the message from RabbitMQ
def process_message(ch, method, properties, body):
    print("Received message from RabbitMQ")
    message = json.loads(body)
    
    # Assuming the message has fields 'user_email', 'subject', and 'body'
    to_email = message['user_email']
    subject = message['subject']
    body = message['body']

    # Send the email
    send_email(to_email, subject, body)

    # Acknowledge message
    ch.basic_ack(delivery_tag=method.delivery_tag)

# Function to start consuming messages from RabbitMQ
def start_consuming():
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    
    # Declare the queue if it doesn't exist
    channel.queue_declare(queue=RABBITMQ_QUEUE)

    # Set up consumer
    channel.basic_consume(queue=RABBITMQ_QUEUE, on_message_callback=process_message)

    print(f"Waiting for messages in {RABBITMQ_QUEUE}. To exit, press CTRL+C")
    channel.start_consuming()

if __name__ == '__main__':
    start_consuming()
