import os

# RabbitMQ settings
RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672/')
RABBITMQ_QUEUE = os.getenv('RABBITMQ_QUEUE', 'notifications')

# Email server settings (SMTP)
SMTP_SERVER = os.getenv('SMTP_SERVER', 'localhost')
SMTP_PORT = os.getenv('SMTP_PORT', 1025)  # Change this to your SMTP port
FROM_EMAIL = os.getenv('FROM_EMAIL', 'no-reply@example.com')
