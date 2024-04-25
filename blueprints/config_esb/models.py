from config.database import TempMDOMSSqlDB


def find_list_service_id(db_site :str, input_param):
    try:
        if db_site == "ESB_MONOLITH_DC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MONOLITH_DRC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MONOLITH_ODC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MSR" :
            db_conn = TempMDOMSSqlDB()
        else :
            raise ValueError("db_site tidak dikenali")
        
        param_query = {
            "serviceId": {
                "table_column": "SERVICE_ID",
                "operand": "=",
                "data_type": "string",
            },
            "esbSvcName": {
                "table_column": "ESB_SVC_NAME",
                "operand": "=",
                "data_type": "string",
            },
        }
        conditions = []
        
        base_query = """SELECT TOP 1000 * FROM [TEMP_MDO].[dbo].[BRI_SERVICE] WITH(NOLOCK)"""

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
            f"""{base_query} WHERE {" AND ".join(conditions)};"""
            if conditions
            else f"""{base_query};"""
        )

        return db_conn.fetch_all(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))
    
def find_service_by_service_id_name(db_site :str, service_id :str, esb_service_name :str):
    try:
        if db_site == "ESB_MONOLITH_DC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MONOLITH_DRC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MONOLITH_ODC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MSR" :
            db_conn = TempMDOMSSqlDB()
        else :
            raise ValueError("db_site tidak dikenali")
        final_query = """SELECT * FROM [TEMP_MDO].[dbo].[BRI_SERVICE] WITH(NOLOCK) WHERE SERVICE_ID = '{service_id}' AND ESB_SVC_NAME = '{esb_service_name}'""".format(service_id=service_id, esb_service_name=esb_service_name)
        return db_conn.fetch_one(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))
    
def update_service_by_service_id_name(db_site :str, service_id :str, esb_service_name :str, new_service_id :str):
    try:
        if db_site == "ESB_MONOLITH_DC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MONOLITH_DRC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MONOLITH_ODC" :
            db_conn = TempMDOMSSqlDB()
        elif db_site == "ESB_MSR" :
            db_conn = TempMDOMSSqlDB()
        else :
            raise ValueError("db_site tidak dikenali")
        final_query = """UPDATE [TEMP_MDO].[dbo].[BRI_SERVICE] SET SERVICE_ID = '{new_service_id}' WHERE SERVICE_ID = '{service_id}' AND ESB_SVC_NAME = '{esb_service_name}'""".format(new_service_id=new_service_id, service_id=service_id, esb_service_name=esb_service_name)
        return db_conn.execute(sql=final_query)
    except Exception as why:
        raise Exception(repr(why))