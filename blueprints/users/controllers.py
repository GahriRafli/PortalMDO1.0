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
import libraries.ldap_helpers as ldapHelp
import blueprints.users.models as userModels
import blueprints.global_parameters.models as globalParamModels

additional_information_token = lambda username, user_status_id, user_matrix_id: {
    "username": username,
    "userStatusId": user_status_id,
    "userMatrixId": user_matrix_id,
}


class UserGroupList(Resource):
    @classmethod
    def get(cls):
        try:
            qry_param = request.args.to_dict()
            user_group_list_data = userModels.get_all_user_group(input_param=qry_param)
            return (
                generateResp.success(respBody=user_group_list_data)
                if user_group_list_data
                else generateResp.noContent()
            )

        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))


class UserMatrixList(Resource):
    @classmethod
    def get(cls):
        try:
            qry_param = request.args.to_dict()
            user_matrix_list_data = userModels.get_all_user_matrix(
                input_param=qry_param
            )
            return (
                generateResp.success(respBody=user_matrix_list_data)
                if user_matrix_list_data
                else generateResp.noContent()
            )

        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))


class UserStatusList(Resource):
    @classmethod
    def get(cls):
        try:
            qry_param = request.args.to_dict()
            user_matrix_list_data = userModels.get_all_user_status(
                input_param=qry_param
            )
            return (
                generateResp.success(respBody=user_matrix_list_data)
                if user_matrix_list_data
                else generateResp.noContent()
            )

        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))


class UserRegistration(Resource):
    @classmethod
    def post(cls):
        try:
            user_register_json = request.get_json()
            reg_username = user_register_json["username"]
            reg_password = userModels.generate_hash(user_register_json["password"])
            reg_email = user_register_json["email"]
            reg_fullname = user_register_json["fullname"]
            if reg_username.isnumeric():
                return generateResp.badRequest(message="Username Numeric hanya dikhususkan untuk PN")
            else:
                user_data_json = {"username":reg_username, "password":reg_password, "email":reg_email, "fullname":reg_fullname}
                userModels.insert_new_user_manual(**user_data_json)
                user_after_insert = userModels.find_user_login_by_username(username=reg_username)
                if user_after_insert :
                    return generateResp.successCreated(respBody=user_after_insert)
                else :
                    generateResp.notFound(message=f"username {reg_username} not found!")
        except KeyError as why:
            current_app.logger.warning(repr(why))
            return generateResp.badRequest(message="Request is missing required fields or incorrect value!", exceptionMessage=repr(why))
        except ValueError as why:
            current_app.logger.warning(repr(why))
            return generateResp.badRequest(message="Duplicate Entry, Username Already Exist!", exceptionMessage=repr(why))
        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))


class UserLogin(Resource):
    @classmethod
    def post(cls):
        try:
            user_login_json = request.get_json()
            current_user = userModels.find_user_login_by_username(
                username=user_login_json["username"]
            )
            param_status_user_active = globalParamModels.find_global_parameters_by_name(
                parameter_name="STATUS_USER_ACTIVE"
            )
            param_default_channel_id = globalParamModels.find_global_parameters_by_name(
                parameter_name="DEFAULT_CHANNEL_ID"
            )
            param_ldap_url = globalParamModels.find_global_parameters_by_name(
                parameter_name="LDAP_URL"
            )
            param_api_close_bristars_url = globalParamModels.find_global_parameters_by_name(
                parameter_name="API_BRISTARS_INQUIRY_PEKERJA_URL"
            )
            param_api_close_auth_token = globalParamModels.find_global_parameters_by_name(
                parameter_name="API_CLOSE_AUTH_TOKEN"
            )
            param_user_agent = request.user_agent
            param_ip_addr = (
                request.headers.getlist("X-Forwarded-For")[0]
                if request.headers.getlist("X-Forwarded-For")
                else request.remote_addr
            )
            if current_user:
                if current_user["auth_type"] == "LDAP":
                    check_ldap_existing_user = ldapHelp.check_ldap_login(
                        ldap_url=param_ldap_url,
                        api_close_bristars_url=param_api_close_bristars_url,
                        auth_token=param_api_close_auth_token,
                        username=user_login_json["username"],
                        password=user_login_json["password"],
                        channel_id=param_default_channel_id,
                        user_agent=param_user_agent,
                        ip_addr=param_ip_addr,
                    )
                    if (
                        check_ldap_existing_user["responseStatus"] is True
                        and check_ldap_existing_user["responseStatusBRIStars"] is True
                    ):
                        pernr_bristars_existing = check_ldap_existing_user[
                            "responseDataBRIStars"
                        ]["pernr"]
                        email_bristars_existing = check_ldap_existing_user[
                            "responseLDAP"
                        ]
                        userModels.update_user_ldap_bristars(
                            id=current_user["id"],
                            username=pernr_bristars_existing,
                            email=email_bristars_existing,
                            last_source_ip_addr=param_ip_addr,
                            last_user_agent=param_user_agent,
                            **check_ldap_existing_user["responseDataBRIStars"]
                        )
                        user_after_update = userModels.find_user_login_by_username(
                            username=user_login_json["username"]
                        )
                        if user_after_update["user_status_id"] == int(
                            param_status_user_active
                        ):
                            return generateResp.successLogin(
                                respBody=user_after_update,
                                respToken={
                                    "access_token": create_access_token(
                                        identity=user_after_update["id"],
                                        additional_claims=additional_information_token(
                                            username=user_after_update["username"],
                                            user_status_id=user_after_update[
                                                "user_status_id"
                                            ],
                                            user_matrix_id=user_after_update[
                                                "user_matrix_id"
                                            ],
                                        ),
                                        fresh=True,
                                    ),
                                    "refresh_token": create_refresh_token(
                                        identity=user_after_update["id"]
                                    ),
                                },
                            )
                        else:
                            return generateResp.unauthorized(
                                message=user_after_update["user_status_message_error"]
                            )
                    elif (
                        check_ldap_existing_user["responseStatus"] is True
                        and check_ldap_existing_user["responseStatusBRIStars"] is False
                    ):
                        pass
                    elif (
                        check_ldap_existing_user["responseStatus"] is False
                        and check_ldap_existing_user["responseMessage"] == "False"
                    ):
                        return generateResp.unauthorized(message="Invalid Credential!")
                    else:
                        return generateResp.unauthorized(
                            message=json.dumps(check_ldap_existing_user)
                        )
                elif current_user["auth_type"] == "MANUAL":
                    user_password = userModels.find_password_user_manual(username=user_login_json["username"])
                    if userModels.verify_hash(password=user_login_json["password"], hash_=user_password["password"]) :
                        if current_user["user_status_id"] == int(
                            param_status_user_active
                        ):
                            userModels.update_login_user_manual(id=current_user["id"], username=current_user["username"], last_source_ip_addr=param_ip_addr, last_user_agent=param_user_agent)
                            return generateResp.successLogin(
                                respBody=current_user,
                                respToken={
                                    "access_token": create_access_token(
                                        identity=current_user["id"],
                                        additional_claims=additional_information_token(
                                            username=current_user["username"],
                                            user_status_id=current_user[
                                                "user_status_id"
                                            ],
                                            user_matrix_id=current_user[
                                                "user_matrix_id"
                                            ],
                                        ),
                                        fresh=True,
                                    ),
                                    "refresh_token": create_refresh_token(
                                        identity=current_user["id"]
                                    ),
                                },
                            )
                        else:
                            return generateResp.unauthorized(
                                message=current_user["user_status_message_error"]
                            )
                    else :
                        return generateResp.unauthorized(message="Invalid Credential!")
                else:
                    return generateResp.unauthorized(
                        message="Invalid Auth Type untuk Existing Username!"
                    )
            else:
                if user_login_json["username"].isnumeric():
                    check_ldap_new_user = ldapHelp.check_ldap_login(
                        ldap_url=param_ldap_url,
                        api_close_bristars_url=param_api_close_bristars_url,
                        auth_token=param_api_close_auth_token,
                        username=user_login_json["username"],
                        password=user_login_json["password"],
                        channel_id=param_default_channel_id,
                        user_agent=param_user_agent,
                        ip_addr=param_ip_addr,
                    )
                    print(check_ldap_new_user)
                    if (
                        check_ldap_new_user["responseStatus"] is True
                        and check_ldap_new_user["responseStatusBRIStars"] is True
                    ):
                        pernr_bristars_new = check_ldap_new_user[
                            "responseDataBRIStars"
                        ]["pernr"]
                        email_bristars_new = check_ldap_new_user["responseLDAP"]
                        userModels.insert_new_user_ldap_bristars(
                            username=pernr_bristars_new,
                            email=email_bristars_new,
                            last_source_ip_addr=param_ip_addr,
                            last_user_agent=param_user_agent,
                            **check_ldap_new_user["responseDataBRIStars"]
                        )
                        user_after_insert = userModels.find_user_login_by_username(
                            username=user_login_json["username"]
                        )
                        if user_after_insert:
                            if user_after_insert["user_status_id"] == int(
                                param_status_user_active
                            ):
                                return generateResp.successLogin(
                                    respBody=user_after_insert,
                                    respToken={
                                        "access_token": create_access_token(
                                            identity=user_after_insert["id"],
                                            additional_claims=additional_information_token(
                                                username=user_after_insert["username"],
                                                user_status_id=user_after_insert[
                                                    "user_status_id"
                                                ],
                                                user_matrix_id=user_after_insert[
                                                    "user_matrix_id"
                                                ],
                                            ),
                                            fresh=True,
                                        ),
                                        "refresh_token": create_refresh_token(
                                            identity=user_after_insert["id"]
                                        ),
                                    },
                                )
                            else:
                                return generateResp.unauthorized(
                                    message=user_after_insert[
                                        "user_status_message_error"
                                    ]
                                )
                    elif (
                        check_ldap_new_user["responseStatus"] is True
                        and check_ldap_new_user["responseStatusBRIStars"] is False
                    ):
                        pass
                    elif (
                        check_ldap_new_user["responseStatus"] is False
                        and check_ldap_new_user["responseMessage"] == "False"
                    ):
                        return generateResp.unauthorized(message="Invalid Credential!")
                    else:
                        return generateResp.unauthorized(
                            message=json.dumps(check_ldap_new_user)
                        )
                else:
                    return generateResp.unauthorized(
                        message="Kombinasi username bukan numeric. Belum terdaftar ke dalam sistem Portal MDO.\r\nSilahkan Hubungi Administrator - MDO untuk pengecekan lebih lanjut."
                    )
        except Exception as why:
            return generateResp.generalError(exceptionMessage=repr(why))


class UserLogoutAccess(Resource):
    @classmethod
    @jwt_required()
    def post(self):
        try:
            jti = get_jwt()["jti"]
            userModels.user_logout_access(jti=jti)
            return generateResp.success(respBody={"revokedAccessToken": get_jwt()})
        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))

class UserList(Resource):
    @classmethod
    @jwt_required()
    def get(self):
        try:
            check_list_user = userModels.find_user_list_except_yourself(user_id=get_jwt_identity())
            if not check_list_user :
                return generateResp.noContent()
            else :
                return generateResp.success(respBody=check_list_user)
        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))
        
class UserUpdate(Resource):
    @classmethod
    @jwt_required()
    def patch(self):
        try:
            user_update_json = request.get_json()
            check_user = userModels.find_user_by_username_id(user_id=user_update_json["id"], username=user_update_json["username"])
            if not check_user :
                return generateResp.notFound(message=f"""Username {user_update_json["username"]} not found!""")
            else :
                userModels.update_user_by_username_id(user_id=user_update_json["id"], username=user_update_json["username"], user_status_id=user_update_json["userStatusId"], user_matrix_id=user_update_json["userMatrixId"])
                check_user_after_update = userModels.find_user_login_by_username(username=user_update_json["username"])
                if not check_user_after_update :
                    return generateResp.notFound(message=f"""Username {user_update_json["username"]} not found!""")
                else :
                    return generateResp.success(respBody=check_user_after_update)  
        except Exception as why:
            current_app.logger.warning(repr(why))
            return generateResp.generalError(exceptionMessage=repr(why))
