import pymysql
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