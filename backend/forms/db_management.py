"""This module focus on contact with MySQL server."""

import json
import pymysql

from datetime import datetime
from decouple import config
from .models import CourseData


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
        self.con = connection
        self.cursor = connection.cursor

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.con.connect()
        self.cursor = self.con.cursor

    @staticmethod
    def send_all_course_data():
        """Send the course_id, course_name, and faculty to frontend."""
        return CourseData.objects.all()


class TableManagement:
    """Class for managing tables in MySQL server."""

    def __init__(self, connection: MySQLConnection):
        self.connection = connection
        self.cursor = None
        self.table_name = ["auth_group_permissions", "auth_user_user_permissions",
                           "auth_user_groups", "auth_group", "auth_permission",
                           "django_admin_log", "auth_user", "django_content_type", "BookMark",
                           "QA", "Summary", "ReviewStat", "CourseReview", "UserData", "CourseData"]

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.connection.connect()
        self.cursor = self.connection.cursor

    def get_table_name(self) -> list:
        """GET all the tables name in MySQL server."""
        self.cursor.execute("SHOW TABLES")

        return self.cursor.fetchall()

    def drop_all_tables(self):
        """
        Drop all tables. In the MySQL server.

        Don't forget to run migrate again after drop_all_table!
        """
        self.connect()

        try:

            for table_name in self.table_name:
                self.cursor.execute(f"DROP TABLE IF EXISTS "
                                    f"{table_name}")

            print("Successfully Dropped tables\n")

        finally:
            self.connection.close()


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

    @staticmethod
    def json_converter(data_from_server):
        """Convert data from MySQL server to JSON."""
        result_data = {}

        for data in data_from_server:

            try:
                result_data[data['faculty']][data['course_id']] = data['course_name']

            except KeyError:
                result_data[data['faculty']] = {}
                result_data[data['faculty']][data['course_id']] = data['course_name']

        return result_data

    @staticmethod
    def check_date():
        """Check is it time to back up?"""
        with open('database/backup/logs.json', 'r', encoding='UTF-8') as log_file:
            last_updated = datetime.strptime(json.load(log_file)['last-updated'], "%Y-%m-%d").date()

        if (datetime.now().date() - last_updated).days >= 7:
            return True
        return False

    def local_backup(self):
        """Used for pull all data from MySQL server to local every week."""

        if self.check_date():
            self.connect()

            try:
                for table in self.table_name:
                    self.cursor.execute(f"SELECT * FROM {table}")

                    # write JSON file in backup folder
                    with open(f"./database/backup/{table.lower()}_data.่json", "w", encoding='UTF-8') as overwrite_file:
                        json.dump(self.json_converter(self.cursor.fetchall()), overwrite_file, ensure_ascii=False, indent=4)
                    print(f"Data saved to database/backup/{table.lower()}_data.json")

            finally:
                self.con.close()

            with open('database/backup/logs.json', 'w', encoding='UTF-8') as log_file:
                json.dump(str(datetime.now().date()), log_file, ensure_ascii=False, indent=4)
            print(f"Data saved to database/backup/logs.json")

    def exist_data_loader(self):
        """Combined all the data in the folder and separate by course programs."""
        with open("./database/scraped_data/inter2.json", "r", encoding="UTF-8") as file:
            inter2 = json.load(file)
        with open("./database/scraped_data/inter1.json", "r", encoding="UTF-8") as file:
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
                        "INSERT INTO CourseData (course_id, faculty, course_type, course_name) "
                        "VALUES (%s, %s, %s)", (course_id, faculty, "inter", course_name)
                    )
                    print(faculty, course_id, "inter", course_name)
                print("Inserting...\n")

            self.con.connection.commit()

            print("Successfully Saved in MySQL server\n")

        finally:

            self.con.close()

