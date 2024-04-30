from config.database import PortalMDODB

from passlib.hash import bcrypt_sha256 as bcrypt_sha256

"""
generate hash from password by encryption using bcrypt_sha256
"""
def generate_hash(password):
    return bcrypt_sha256.hash(password)

"""
Verify hash and password
"""
def verify_hash(password, hash_):
    return bcrypt_sha256.verify(password, hash_)

"""
Check is jti blacklisted
"""
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
        final_query = """INSERT INTO `user_login` (`username`, `email`, `fullname`, `orgeh`, `werksTX`, `btrtlTX`, `kstlTX`, `orgehTX`, `stellTX`, `branch`, `tipeUker`, `htext`, `corpTitle`, `last_source_ip_addr`, `last_user_agent`, `last_login`) VALUES (%(username)s, %(email)s, %(sname)s, %(orgeh)s, %(werksTX)s, %(btrtlTX)s, %(kstlTX)s, %(orgehTX)s, %(stellTX)s, %(branch)s, %(tipeUker)s, %(htext)s, %(corpTitle)s, %(last_source_ip_addr)s, %(last_user_agent)s, NOW());"""
        return db_conn.execute(sql=final_query, username=username,
            email=email,
            last_source_ip_addr=last_source_ip_addr,
            last_user_agent=last_user_agent,
            **respBRIStars,)
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
        final_query = """UPDATE `user_login` SET `email`=%(email)s, `fullname`=%(sname)s, `orgeh`=%(orgeh)s,\
            `werksTX`=%(werksTX)s, `btrtlTX`=%(btrtlTX)s, `kstlTX`=%(kstlTX)s, `orgehTX`=%(orgehTX)s,\
            `stellTX`=%(stellTX)s, `branch`=%(branch)s, `tipeUker`=%(tipeUker)s, `htext`=%(htext)s, `corpTitle`=%(corpTitle)s,\
            `last_source_ip_addr`=%(last_source_ip_addr)s, `last_user_agent`=%(last_user_agent)s, `last_login`=NOW()\
            WHERE `id`=%(id)s AND `username`=%(username)s;"""
        return db_conn.execute(sql=final_query, id=id,
            username=username,
            email=email,
            last_source_ip_addr=last_source_ip_addr,
            last_user_agent=last_user_agent,
            **respBRIStars,)
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
        final_query = """INSERT INTO `user_blacklist_token` (`jti`) VALUES (%(jti)s);"""
        return db_conn.execute(sql=final_query, jti=jti)
    except Exception as why:
        raise Exception(repr(why))

def insert_new_user_manual(**user_data):
    try:
        db_conn = PortalMDODB()
        final_query = """INSERT INTO `user_login` (`username`, `auth_type`, `password`, `email`, `fullname`) VALUES (%(username)s, 'MANUAL', %(password)s, %(email)s, %(fullname)s);"""
        return db_conn.execute(sql=final_query, **user_data)
    except Exception as why:
        raise Exception(repr(why))
    
def update_login_user_manual(
    id: int,
    username: str,
    last_source_ip_addr: str,
    last_user_agent: str,
):
    try:
        db_conn = PortalMDODB()
        final_query = """UPDATE `user_login` SET `last_source_ip_addr`=%(last_source_ip_addr)s, `last_user_agent`=%(last_user_agent)s, `last_login`=NOW()\
            WHERE `id`=%(id)s AND `username`=%(username)s;"""
        return db_conn.execute(sql=final_query, id=id,
            username=username,
            last_source_ip_addr=last_source_ip_addr,
            last_user_agent=last_user_agent,)
    except Exception as why:
        raise Exception(repr(why))

def find_password_user_manual(username :str):
    try :
        db_conn = PortalMDODB()
        final_query = """SELECT A.password FROM `user_login` A WHERE A.username=%(username)s;"""
        return db_conn.fetch_one(sql=final_query, username=username)
    except Exception as why:
        raise Exception(repr(why))
    
def find_user_by_username_id(user_id :int, username :str):
    try :
        db_conn = PortalMDODB()
        final_query = """SELECT * FROM user_login A WHERE A.id=%(user_id)s AND A.username=%(username)s;"""
        return db_conn.fetch_one(sql=final_query, user_id=user_id, username=username)
    except Exception as why:
        raise Exception(repr(why))
    
def update_user_by_username_id(user_id :int, username :str, user_status_id :int, user_matrix_id :int):
    try :
        db_conn = PortalMDODB()
        final_query = """UPDATE `user_login` SET `user_status_id`=%(user_status_id)s, `user_matrix_id`=%(user_matrix_id)s WHERE `id`=%(user_id)s AND `username`=%(username)s;"""
        return db_conn.execute(sql=final_query, user_id=user_id, username=username, user_status_id=user_status_id, user_matrix_id=user_matrix_id)
    except Exception as why:
        raise Exception(repr(why))
    
def find_user_list_except_yourself(user_id :int):
    try :
        db_conn = PortalMDODB()
        final_query = """SELECT A.id, A.username, A.auth_type,\
            A.user_status_id, B.status_desc AS user_status_desc, B.message_error AS user_status_message_error,\
            A.user_matrix_id, C.user_matrix_desc, C.user_role,\
            A.photo_profile, A.email, A.fullname, A.orgeh,\
            A.werksTX, A.btrtlTX, A.kstlTX, A.orgehTX, A.stellTX,\
            A.branch, A.tipeUker, A.htext, A.corpTitle,\
            A.last_source_ip_addr, A.last_user_agent, A.last_login, A.created_at, A.updated_at\
            FROM user_login A\
            INNER JOIN user_status B ON A.user_status_id = B.id\
            INNER JOIN user_matrix C ON A.user_matrix_id = C.id\
            WHERE A.id != %(user_id)s;"""
        return db_conn.fetch_all(sql=final_query, user_id=user_id)
    except Exception as why:
        raise Exception(repr(why))