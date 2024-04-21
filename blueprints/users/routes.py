from flask import Blueprint
from flask_restful import Api

import blueprints.users.controllers as userControllers

bp_users = Blueprint("users", __name__)
api = Api(bp_users)

api.add_resource(userControllers.UserGroupList, "/v1.0/users/group-list")
api.add_resource(userControllers.UserMatrixList, "/v1.0/users/matrix-list")
api.add_resource(userControllers.UserStatusList, "/v1.0/users/status-list")
api.add_resource(userControllers.UserLogin, "/v1.0/users/login")
api.add_resource(userControllers.UserLogoutAccess, "/v1.0/users/logout")