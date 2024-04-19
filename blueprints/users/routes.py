from flask import Blueprint
from flask_restful import Api

from .controllers import UserGroupList

bp_users = Blueprint("users", __name__)
api = Api(bp_users)

api.add_resource(UserGroupList, "/v1.0/users/group-list")