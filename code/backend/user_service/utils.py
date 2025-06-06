import bcrypt

# Hash the user's password
def hash_password(password):
    """
    Hash a plain-text password using bcrypt.
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Verify a password against its hash
def verify_password(password, password_hash):
    """
    Verify the plain-text password against the stored hashed password.
    """
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
