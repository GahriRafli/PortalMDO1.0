import json, logging, os
from logging.handlers import RotatingFileHandler
import datetime as dt
from flask import Flask, request, g
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager, decode_token


import config.environment as env
import libraries.generate_response as generateResp
from blueprints.users.models import is_jti_blacklisted

from blueprints.users.routes import bp_users


app = Flask(__name__)
api = Api(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # allow cross origin
app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["JWT_SECRET_KEY"] = env.APP_JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = dt.timedelta(
    minutes=int(env.APP_ACCESS_TOKEN_EXPIRES)
)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = dt.timedelta(
    minutes=int(env.APP_REFRESH_TOKEN_EXPIRES)
)
app.config["UPLOADED_FILES"] = "static"


"""START LOGGING
Setting Logging menggunakan Rotating File Handler setiap 10MB akan create file baru"""
formatter = logging.Formatter(
    "[%(asctime)s] [PID : %(process)d] [%(pathname)s : %(lineno)d] %(levelname)s - %(message)s"
)
log_filename = f"""{env.APP_API_LOG_PATH}"""
os.makedirs(os.path.dirname(log_filename), exist_ok=True)
log_handler = RotatingFileHandler(log_filename, maxBytes=10000000, backupCount=10)
log_handler.setLevel(logging.DEBUG)
log_handler.setFormatter(formatter)
app.logger.addHandler(log_handler)
"""END LOGGING"""

"""START REGISTER BLUEPRINT"""
app.register_blueprint(bp_users)

# Checking that token is in blacklist or not
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return is_jti_blacklisted(jti=jti)


# The following callbacks are used for customizing jwt response/error messages.
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return generateResp.unauthorized(code="999", message="The token has expired!")


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return generateResp.unauthorized(
        code="999", message="Signature verification failed!"
    )


@jwt.unauthorized_loader
def missing_token_callback(error):
    return generateResp.unauthorized(
        code="999", message="Request does not contain an access token!"
    )


@jwt.needs_fresh_token_loader
def token_not_fresh_callback():
    return generateResp.unauthorized(code="999", message="The token is not fresh!")


@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return generateResp.unauthorized(code="999", message="The token has been revoked!")
