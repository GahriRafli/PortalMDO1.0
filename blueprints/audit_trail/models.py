from config.database import PortalMDODB


def insert_api_audit_trail(**param_audit_trail):
    try:
        db_conn = PortalMDODB()
        final_query = """INSERT INTO `api_audit_log` (`username`, `request_method`, `request_path`, `request_endpoint`, `request_data`, `request_user_agent`, `request_remote_addr`, `request_timestamp`, `response_status`, `response_status_code`, `response_data`, `response_timestamp`, `elapsed_time`) VALUES (%(username)s, %(request_method)s, %(request_path)s, %(request_endpoint)s, %(request_data)s, %(request_user_agent)s, %(request_remote_addr)s, %(request_timestamp)s, %(response_status)s, %(response_status_code)s, %(response_data)s, %(response_timestamp)s, %(elapsed_time)s);"""
        return db_conn.execute(sql=final_query, **param_audit_trail)
    except Exception as why:
        raise Exception(repr(why))
