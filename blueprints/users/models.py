from config.database import PortalMDODB


def is_jti_blacklisted(jti: str):
    try:
        db_conn = PortalMDODB()
        sql_text = f"""SELECT * FROM user_blacklist_token WHERE jti = '{jti}';"""
        return bool(db_conn.fetch_one(sql=sql_text))
    except Exception as why:
        raise Exception(repr(why))


def get_all_user_group(input_param):
    try:
        db_conn = PortalMDODB()
        param_query = {
            "isActive": {
                "table_column": "is_active",
                "operand": "=",
                "data_type": "string",
            },
            "isItDirectorate": {
                "table_column": "is_it_directorate",
                "operand": "=",
                "data_type": "string",
            },
            "isDivision": {
                "table_column": "is_division",
                "operand": "=",
                "data_type": "string",
            },
            "isDepartment": {
                "table_column": "is_department",
                "operand": "=",
                "data_type": "string",
            },
            "isGroup": {
                "table_column": "is_group",
                "operand": "=",
                "data_type": "string",
            },
        }
        conditions = []
        base_query = f"""SELECT * FROM user_group"""
        order_query = f"""ORDER BY id ASC"""
        if input_param:
            input_param_filtered = {
                k: v
                for k, v in input_param.items()
                if v is not None and v != "" and k in param_query.keys()
            }
            for k, v in input_param_filtered.items():
                if param_query[k]["operand"] == "LIKE":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} '%{v}%'"""
                    )
                elif param_query[k]["data_type"] == "string":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} '{v}'"""
                    )
                elif param_query[k]["data_type"] == "integer":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} {v}"""
                    )

        final_query = (
            f"""{base_query} WHERE {" AND ".join(conditions)} {order_query};"""
            if conditions
            else f"""{base_query} {order_query};"""
        )
        return db_conn.fetch_all(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))


def get_all_user_matrix(input_param):
    try:
        db_conn = PortalMDODB()
        param_query = {
            "isActive": {
                "table_column": "A.is_active",
                "operand": "=",
                "data_type": "string",
            },
            "userRole": {
                "table_column": "A.user_role",
                "operand": "=",
                "data_type": "string",
            },
        }
        conditions = []
        base_query = f"""SELECT A.id, A.user_matrix_desc, A.is_active, A.user_group_id, B.prefix AS user_group_prefix,\
            A.user_role, A.created_at, A.updated_at FROM user_matrix A\
            INNER JOIN user_group B ON A.user_group_id = B.id"""
        order_query = f"""ORDER BY A.id ASC"""
        if input_param:
            input_param_filtered = {
                k: v
                for k, v in input_param.items()
                if v is not None and v != "" and k in param_query.keys()
            }
            for k, v in input_param_filtered.items():
                if param_query[k]["operand"] == "LIKE":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} '%{v}%'"""
                    )
                elif param_query[k]["data_type"] == "string":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} '{v}'"""
                    )
                elif param_query[k]["data_type"] == "integer":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} {v}"""
                    )

        final_query = (
            f"""{base_query} WHERE {" AND ".join(conditions)} {order_query};"""
            if conditions
            else f"""{base_query} {order_query};"""
        )
        return db_conn.fetch_all(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))


def get_all_user_status(input_param):
    try:
        db_conn = PortalMDODB()
        param_query = {
            "isActive": {
                "table_column": "A.is_active",
                "operand": "=",
                "data_type": "string",
            }
        }
        conditions = []
        base_query = f"""SELECT A.* FROM user_status A"""
        order_query = f"""ORDER BY A.id ASC"""
        if input_param:
            input_param_filtered = {
                k: v
                for k, v in input_param.items()
                if v is not None and v != "" and k in param_query.keys()
            }
            for k, v in input_param_filtered.items():
                if param_query[k]["operand"] == "LIKE":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} '%{v}%'"""
                    )
                elif param_query[k]["data_type"] == "string":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} '{v}'"""
                    )
                elif param_query[k]["data_type"] == "integer":
                    conditions.append(
                        f"""{param_query[k]["table_column"]} {param_query[k]["operand"]} {v}"""
                    )

        final_query = (
            f"""{base_query} WHERE {" AND ".join(conditions)} {order_query};"""
            if conditions
            else f"""{base_query} {order_query};"""
        )
        return db_conn.fetch_all(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))


def find_user_login_by_username(username: str):
    try:
        db_conn = PortalMDODB()
        final_query = f"""SELECT A.id, A.username, A.auth_type,\
            A.user_status_id, B.status_desc AS user_status_desc, B.message_error AS user_status_message_error,\
            A.user_matrix_id, C.user_matrix_desc, C.user_role,\
            A.photo_profile, A.email, A.fullname, A.orgeh,\
            A.werksTX, A.btrtlTX, A.kstlTX, A.orgehTX, A.stellTX,\
            A.branch, A.tipeUker, A.htext, A.corpTitle,\
            A.last_source_ip_addr, A.last_user_agent, A.last_login, A.created_at, A.updated_at\
            FROM user_login A\
            INNER JOIN user_status B ON A.user_status_id = B.id\
            INNER JOIN user_matrix C ON A.user_matrix_id = C.id\
            WHERE A.username = '{username}';"""
        return db_conn.fetch_one(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))


def insert_new_user_ldap_bristars(
    username: str,
    email: str,
    last_source_ip_addr: str,
    last_user_agent: str,
    **respBRIStars,
):
    try:
        db_conn = PortalMDODB()
        final_query = """INSERT INTO `user_login` (`username`, `email`, `fullname`, `orgeh`, `werksTX`, `btrtlTX`, `kstlTX`, `orgehTX`, `stellTX`, `branch`, `tipeUker`, `htext`, `corpTitle`, `last_source_ip_addr`, `last_user_agent`, `last_login`) VALUES ('{username}', '{email}', '{sname}', '{orgeh}', '{werksTX}', '{btrtlTX}', '{kstlTX}', '{orgehTX}', '{stellTX}', '{branch}', '{tipeUker}', '{htext}', '{corpTitle}', '{last_source_ip_addr}', '{last_user_agent}', NOW());""".format(
            username=username,
            email=email,
            last_source_ip_addr=last_source_ip_addr,
            last_user_agent=last_user_agent,
            **respBRIStars,
        )
        return db_conn.execute(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))


def update_user_ldap_bristars(
    id: int,
    username: str,
    email: str,
    last_source_ip_addr: str,
    last_user_agent: str,
    **respBRIStars,
):
    try:
        db_conn = PortalMDODB()
        final_query = """UPDATE `user_login` SET `email`='{email}', `fullname`='{sname}', `orgeh`='{orgeh}',\
            `werksTX`='{werksTX}', `btrtlTX`='{btrtlTX}', `kstlTX`='{kstlTX}', `orgehTX`='{orgehTX}',\
            `stellTX`='{stellTX}', `branch`='{branch}', `tipeUker`='{tipeUker}', `htext`='{htext}', `corpTitle`='{corpTitle}',\
            `last_source_ip_addr`='{last_source_ip_addr}', `last_user_agent`='{last_user_agent}', `last_login`=NOW()\
            WHERE `id`={id} AND `username`='{username}';""".format(
            id=id,
            username=username,
            email=email,
            last_source_ip_addr=last_source_ip_addr,
            last_user_agent=last_user_agent,
            **respBRIStars,
        )
        return db_conn.execute(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))


def insert_new_user_ldap_non_bristars():
    pass


def update_user_ldap_non_bristars():
    pass


def find_list_user():
    pass


def user_logout_access(jti: str):
    try:
        db_conn = PortalMDODB()
        final_query = """INSERT INTO `user_blacklist_token` (`jti`) VALUES ('{jti}');""".format(
            jti=jti
        )
        return db_conn.execute(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))
