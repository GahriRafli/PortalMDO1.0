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
