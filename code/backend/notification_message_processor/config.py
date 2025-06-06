import os

# RabbitMQ settings
RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672/')
RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE', 'notifications')

# User Service URL (for fetching email if not provided)
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user_service:5001/api/v1/users')
