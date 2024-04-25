from flask import Blueprint
from flask_restful import Api

import blueprints.config_esb.controllers as esbMonoControllers

bp_config_esb_monolith = Blueprint("config_esb_monolith", __name__)
api = Api(bp_config_esb_monolith)

api.add_resource(esbMonoControllers.ServiceList, "/v1.0/configs/esb-service")
api.add_resource(esbMonoControllers.ServiceUpdate, "/v1.0/configs/<string:service_id>/esb-service")