from functools import wraps
from flask import jsonify
from role_verifier import RoleVerifier
from utils import verify_token, access_denied_error, token_missing_error

class RoleRequiredDecorator:
    def __init__(self, required_role):
        self.required_role = required_role

    def __call__(self, f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user, error, status = verify_token()
            if error:
                return jsonify(error), status

            if not RoleVerifier.has_access(user['role'], self.required_role):
                return access_denied_error(self.required_role)

            return f(*args, **kwargs)
        return decorated_function
