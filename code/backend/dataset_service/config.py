import os

# PostgreSQL Database URL
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://admin:admin123@postgresql_db:5432/my_database')
SQLALCHEMY_TRACK_MODIFICATIONS = False

