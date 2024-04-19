# IMPORT Library
import os, json
import datetime as dt
from flask_restful import Resource, reqparse
from flask import request, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

# IMPORT Local Setting
import libraries.generate_response as generateResp
from .models import get_all_user_group


class UserGroupList(Resource):
    @classmethod
    def get(cls):
        try:
            qry_param = request.args.to_dict()
            user_group_list_data = get_all_user_group(input_param=qry_param)
            return generateResp.success(respBody=user_group_list_data) if user_group_list_data else generateResp.success(respBody=[])
                
        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))