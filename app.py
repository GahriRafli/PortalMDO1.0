import json, logging, os
from logging.handlers import RotatingFileHandler
import datetime as dt
from flask import Flask, request, g
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager, decode_token


import config.environment as env
import libraries.generate_response as generateResp
import libraries.general_helpers as generalHelp
from blueprints.users.models import is_jti_blacklisted
from blueprints.audit_trail.models import insert_api_audit_trail

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
"""END REGISTER BLUEPRINT"""

# Logging Before dan After Request
@app.before_request
def before_request_callback():
    """
    Sebelum request diproses dilakukan :
    - Decode Token untuk mendapatkan user_id dari JWT jika request tersebut menggunakan Authorization Bearer Token
    - Pencatatan epoch timestamp request time dalam satuan milisecond
    """

    if request.method != "GET":
        g.username = (
            decode_token(request.headers["Authorization"].replace("Bearer ", ""))["username"]
            if "Authorization" in request.headers
            else None
        )
        g.requestTime = dt.datetime.now().timestamp()
    else:
        pass


@app.after_request
def after_request_callback(response):
    """
    Setelah request diproses sebelum response ke depan dilakukan :
    - JIKA METHOD == GET dan STATUS CODE > 201 (alias GET yang gagal), maka :
        - Dilakukan logging request response pada file text

    - JIKA METHOD != GET untuk semua STATUS CODE, maka :
        - Pencatatan epoch timestamp response time dalam satuan milisecond
        - Insert log request, response dan elapsed time pada database
    """

    if request.method == "GET" and response.status_code > 201:
        app.logger.warning(
            "REQUEST LOG\t%s %s",
            request.method,
            json.dumps(
                {
                    "request": request.args.to_dict(),
                    "response": json.loads(response.data.decode("utf-8")),
                }
            ),
        )
    # elif request.method != "GET" and response.status_code > 201:
    elif request.method != "GET":
        g.responseTime = dt.datetime.now().timestamp()

        audit_log_json = {
            "username":g.username,
            "request_method":request.method,
            "request_path":request.path,
            "request_endpoint":request.endpoint,
            "request_data": json.dumps(generalHelp.doMaskPassword(request.get_json())) if request.content_type is not None else None,
            "request_user_agent":request.user_agent,
            "request_remote_addr":request.headers.getlist("X-Forwarded-For")[0] if request.headers.getlist("X-Forwarded-For") else request.remote_addr,
            "request_timestamp":g.requestTime,
            "response_status":response.status,
            "response_status_code":response.status_code,
            "response_data":json.dumps(json.loads(response.data.decode("utf-8"))) if response.data is not None else None,
            "response_timestamp":g.responseTime,
            "elapsed_time":float(g.responseTime - g.requestTime),
        }

        insert_api_audit_trail(**audit_log_json)

        """
        LOGGING KE FILE DIMATIKAN SEMENTARA
        Karena sudah masuk ke database api_audit_log
        """
        # app.logger.warning(
        #     "REQUEST LOG\t%s %s",
        #     request.method,
        #     json.dumps(
        #         {
        #             "request": request.get_json(),
        #             "response": json.loads(response.data.decode("utf-8")),
        #         }
        #     ),
        # )
    else:
        pass
    return response

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
