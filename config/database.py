import pymysql, pyodbc
import config.environment as env


class PortalMDODB:
    def __init__(self):
        self.host = env.DEFAULT_DB_HOST
        self.port = env.DEFAULT_DB_PORT
        self.user = env.DEFAULT_DB_USERNAME
        self.kunci_gembok = env.DEFAULT_DB_KUNCI_GEMBOK
        self.database = env.DEFAULT_DB_DATABASE
        self.write_timeout = env.DEFAULT_DB_WRITE_TIMEOUT
        self.read_timeout = env.DEFAULT_DB_READ_TIMEOUT
        self.connect_timeout = env.DEFAULT_DB_CONNECT_TIMEOUT
        self.max_allowed_packet = env.DEFAULT_DB_MAX_ALLOWED_PACKET

    def __connect__(self):
        self.con = pymysql.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.kunci_gembok,
            database=self.database,
            cursorclass=pymysql.cursors.DictCursor,
            write_timeout=self.write_timeout,
            read_timeout=self.read_timeout,
            connect_timeout=self.connect_timeout,
            autocommit=False,
            max_allowed_packet=self.max_allowed_packet,
        )
        self.cur = self.con.cursor()

    def __disconnect__(self):
        self.con.close()

    def __commit__(self):
        self.con.commit()

    def __rollback__(self):
        self.con.rollback()

    def fetch_all(self, sql, **kwargs):
        self.__connect__()
        self.cur.execute(sql, kwargs)
        result = self.cur.fetchall()
        self.__disconnect__()
        return result

    def fetch_one(self, sql, **kwargs):
        self.__connect__()
        self.cur.execute(sql, kwargs)
        result = self.cur.fetchone()
        self.__disconnect__()
        return result

    def execute(self, sql, **kwargs):
        self.__connect__()
        self.cur.execute(sql, kwargs)
        self.__commit__()
        self.__disconnect__()



class TempMDOMSSqlDB:
    def __init__(self):
        self.host = env.TEMP_MDO_MSSQL_DB_HOST
        self.port = env.TEMP_MDO_MSSQL_DB_PORT
        self.user = env.TEMP_MDO_MSSQL_DB_USERNAME
        self.kunci_gembok = env.TEMP_MDO_MSSQL_DB_KUNCI_GEMBOK
        self.database = env.TEMP_MDO_MSSQL_DB_DATABASE

    def __connect__(self):
        odbc_driver = """DRIVER={ODBC Driver 17 for SQL Server};"""
        self.con = pyodbc.connect("""{odbc_driver}SERVER={host}; PORT={port}; DATABASE={database}; UID={username}; PWD={kunci_gembok};""".format(odbc_driver=odbc_driver, host=self.host, port=self.port, database=self.database, username=self.user, kunci_gembok=self.kunci_gembok))
        self.cur = self.con.cursor()

    def __disconnect__(self):
        self.con.close()

    def __commit__(self):
        self.con.commit()

    def __rollback__(self):
        self.con.rollback()

    def fetch_all(self, sql):
        self.__connect__()
        self.cur.execute(sql, args)
        result = [dict(zip([column[0].lower() for column in self.cur.description], row)) for row in self.cur.fetchall()]
        self.__disconnect__()
        return result

    def fetch_one(self, sql):
        self.__connect__()
        self.cur.execute(sql)
        query_result = self.cur.fetchone()
        result = dict(zip([column[0] for column in self.cur.description], query_result)) if query_result else None
        self.__disconnect__()
        return result

    def execute(self, sql, *args):
        self.__connect__()
        self.cur.execute(sql, args)
        self.__commit__()
        self.__disconnect__()