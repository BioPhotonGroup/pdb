import pika
import json
from config import RABBITMQ_URL, RABBITMQ_QUEUE

# Helper function to send a message to RabbitMQ
def send_to_rabbitmq(message):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue=RABBITMQ_QUEUE)
    channel.basic_publish(exchange='', routing_key=RABBITMQ_QUEUE, body=json.dumps(message))
    connection.close()
