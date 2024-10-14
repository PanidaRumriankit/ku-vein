import json
import pymysql

from decouple import config


class MySQLConnection:
    """Class for connect to the MySQL server."""

    def __init__(self):
        self.connection = None
        self.cursor = None

    def connect(self):
        """Connect to MySQL server."""
        timeout = 10
        self.connection = pymysql.connect(
            charset="utf8mb4",
            connect_timeout=timeout,
            cursorclass=pymysql.cursors.DictCursor,
            db=config('MYSQLDATABASE', cast=str,
                      default='Nergigante'),
            host=config('MYSQLHOST', cast=str,
                        default='Yes Indeed'),
            password=config('MYSQLPASS', cast=str,
                            default='do_not_give_up_skeleton'),
            read_timeout=timeout,
            port=22924,
            user=config('MYSQLUSER', cast=str,
                        default='praise_the_sun'),
            write_timeout=timeout,
        )

        self.cursor = self.connection.cursor()

    def close(self):
        """Close MySQL connection."""
        if self.connection:
            self.connection.close()

class DatabaseManagement:
    """Main class for handle the request from frontend"""
    def __init__(self, connection: MySQLConnection):
        self.data = None
        self.connection = connection
        self.cursor = connection.cursor

        self.table_name = ['BookMark', 'QA', 'Summary', 'CourseReview', 'UserData', 'ReviewStat', 'CourseData']

    def send_all_course_data(self):
        pass

class TableManagement:
    """Class for managing tables in MySQL server."""

    def __init__(self, connection: MySQLConnection):
        self.connection = connection
        self.cursor = None
        self.table_names = ['BookMark', 'QA', 'Summary', 'CourseReview', 'UserData', 'ReviewStat', 'CourseData']

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.connection.connect()
        self.cursor = self.connection.cursor

    def table_initialize(self):
        """Create table in MySQL server."""

        self.connect()

        try:

            self.drop_all_tables()
            self.cursor.execute("CREATE TABLE CourseData(course_id VARCHAR(20), faculty VARCHAR(100),"
                                " course_name LONGTEXT, PRIMARY KEY (course_id, faculty))")

            self.cursor.execute("CREATE TABLE ReviewStat(review_id INT, course_id VARCHAR(20), "
                                "date_data DATE, grade CHAR(1), upvotes INT, "
                                "PRIMARY KEY (review_id), "
                                "FOREIGN KEY (course_id) REFERENCES CourseData(course_id) ON DELETE CASCADE)")

            self.cursor.execute("CREATE TABLE UserData(user_id INT UNIQUE, user_name VARCHAR(30) UNIQUE, "
                                "user_type VARCHAR(20), email LONGTEXT, PRIMARY KEY (user_id))")

            self.cursor.execute("CREATE TABLE CourseReview(review_id INT UNIQUE, user_id INT, course_id VARCHAR(20),"
                                " reviews LONGTEXT, PRIMARY KEY (user_id, course_id),"
                                " FOREIGN KEY (user_id) REFERENCES UserData(user_id) ON DELETE CASCADE,"
                                " FOREIGN KEY (course_id) REFERENCES CourseData(course_id) ON DELETE CASCADE)")

            self.cursor.execute("CREATE TABLE Summary(course_id VARCHAR(20), user_id INT, sum_text LONGTEXT,"
                                " PRIMARY KEY (user_id, course_id),"
                                " FOREIGN KEY (user_id) REFERENCES UserData(user_id) ON DELETE CASCADE,"
                                " FOREIGN KEY (course_id) REFERENCES CourseData(course_id) ON DELETE CASCADE)")

            self.cursor.execute("CREATE TABLE QA(question_id INT UNIQUE, user_id INT, comment LONGTEXT,"
                                " PRIMARY KEY (question_id, user_id),"
                                " FOREIGN KEY (user_id) REFERENCES UserData(user_id) ON DELETE CASCADE)")

            self.cursor.execute("CREATE TABLE BookMark(review_id INT, user_id INT,"
                                " PRIMARY KEY (review_id, user_id),"
                                " FOREIGN KEY (review_id) REFERENCES CourseReview(review_id) ON DELETE CASCADE,"
                                " FOREIGN KEY (user_id) REFERENCES UserData(user_id) ON DELETE NO ACTION)")

        finally:
            self.connection.close()

    def drop_all_tables(self):
        """Drop all tables."""
        for table_name in self.table_names:
            self.cursor.execute(f"DROP TABLE IF EXISTS {table_name}")


class DatabaseBackup:
    """Class for database backup."""

    def __init__(self, connection: MySQLConnection):
        self.data = None
        self.con = connection
        self.cursor = None

        self.table_name = ['BookMark', 'QA', 'Summary', 'CourseReview', 'UserData', 'ReviewStat', 'CourseData']

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.con.connect()
        self.cursor = self.con.cursor

    def json_converter(self, data_from_server):
        """Convert data from MySQL server to JSON."""
        result_data = {}

        for data in data_from_server:

            try:
                result_data[data['faculty']][data['course_id']] = data['course_name']

            except KeyError:
                result_data[data['faculty']] = {}
                result_data[data['faculty']][data['course_id']] = data['course_name']

        return result_data

    def local_backup(self):
        """Used for pull all data from MySQL server to local every sunday."""

        try:
            for table in self.table_name:
                self.cursor.execute(f"SELECT * FROM {table}")

                # write JSON file in backup folder
                with open(f"./database/backup/{table.lower()}_data", "w", encoding='utf-8') as overwrite_file:
                    json.dump(self.json_converter(self.cursor.fetchall()), overwrite_file, ensure_ascii=False, indent=4)
                print(f"Data saved to database/backup/{table.lower()}_data.json")

        finally:
            self.con.close()

    def exist_data_loader(self):
        """Combined all the data in the folder and separate by course programs."""
        with open("./database/inter2.json", "r", encoding="UTF-8") as file:
            inter2 = json.load(file)
        with open("./database/inter1.json", "r", encoding="UTF-8") as file:
            inter1 = json.load(file)

        all_faculty = {second: {} for second in inter2.keys()}
        first_term = {first: {} for first in inter1.keys()}
        all_faculty.update(first_term)

        for key, vals in inter2.items():
            all_faculty[key].update(vals)

        for key, vals in inter1.items():
            all_faculty[key].update(vals)

        self.data = all_faculty

    def insert_data_to_remote(self):
        """Used for insert the backup database to the database server."""

        self.connect()

        try:

            for faculty, course_data in self.data.items():
                for course_id, course_name in course_data.items():
                    self.cursor.execute(
                        "INSERT INTO CourseData (course_id, faculty, course_name) "
                        "VALUES (%s, %s, %s)", (course_id, faculty, course_name)
                    )
                    print(faculty, course_id, course_name)
                print("Inserting...")

            self.cursor.execute("SELECT * FROM CourseData")
            print(f"Result: {self.cursor.fetchall()}")

            self.con.connection.commit()
        finally:

            self.con.close()


t = TableManagement(MySQLConnection())
t.table_initialize()
d = DatabaseBackup(MySQLConnection())
d.exist_data_loader()
d.insert_data_to_remote()
d.local_backup()