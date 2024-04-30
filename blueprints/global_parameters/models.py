from config.database import PortalMDODB


def find_global_parameters_by_name(parameter_name: str):
    try:
        db_conn = PortalMDODB()
        final_query = f"""SELECT A.param_value FROM global_parameters A WHERE A.param_name = '{parameter_name}';"""
        hasil_query = db_conn.fetch_one(sql=final_query)
        if hasil_query:
            return hasil_query["param_value"]
        else:
            raise ValueError("Nama Parameter tidak ditemukan!")
    except Exception as why:
        raise Exception(repr(why))
