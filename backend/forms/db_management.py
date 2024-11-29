"""This module focus on contact with MySQL server."""

import json
from datetime import datetime

import pymysql
from decouple import config

from .models import CourseData, Inter


class MySQLConnection:
    """Class for connect to the MySQL server."""

    def __init__(self):
        """Define attributes."""
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


class TableManagement:
    """Class for managing tables in MySQL server."""

    def __init__(self):
        """Define attributes."""
        self.connection = MySQLConnection()
        self.cursor = None
        self.table_name = ["auth_group_permissions",
                           "auth_user_user_permissions",
                           "auth_user_groups", "auth_group", "auth_permission",
                           "django_admin_log", "auth_user",
                           "History", "BookMark",
                           "django_content_type", "django_migrations",
                           "django_session", "Comment",
                           "QAQuestionUpvote", "QAAnswerUpvote",
                           "QA", "QAAnswer", "QAQuestion", "Summary",
                           "Note", "UpvoteStat", "History",
                           "ReviewStat", "CourseReview",
                           "FollowData", "UserData", "Inter", "Normal",
                           "Special", "CourseData"]

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.connection.connect()
        self.cursor = self.connection.cursor

    def get_table_name(self) -> list:
        """GET all the tables name in MySQL server."""
        self.connect()

        self.cursor.execute("SHOW TABLES")

        self.connection.close()

        return self.cursor.fetchall()

    def drop_all_tables(self):
        """
        Drop all tables. In the MySQL server.

        Don't forget to run migrate again after drop_all_table!
        """
        self.connect()

        try:

            for table_name in self.table_name:
                print(table_name)
                self.cursor.execute(f"DROP TABLE IF EXISTS "
                                    f"{table_name}")

            print("Successfully Dropped tables\n")

        finally:
            self.connection.close()

    def show_data(self, table_name: str):
        """Return all data from the specific table."""
        self.connect()

        try:
            self.cursor.execute(
                f"SELECT * FROM {table_name}"
            )

            for table_data in self.cursor.fetchall():
                print(table_data)

        finally:
            self.connection.close()

    def show_attr(self, table_name: str):
        """Show all attribute of the table."""
        self.connect()

        try:
            self.cursor.execute(
                f"SHOW COLUMNS FROM {table_name}"
            )

            for table_data in self.cursor.fetchall():
                print(table_data)

        finally:
            self.connection.close()


class DatabaseManagement:
    """Class for add or delete value in MySQL server."""

    def __init__(self):
        """Define attributes."""
        self.data = None
        self.con = MySQLConnection()
        self.cursor = None

        self.table_name = ['BookMark', 'QA', 'Summary', 'CourseReview',
                           'UserData', 'ReviewStat', 'Inter', 'Normal',
                           'Special', 'CourseData']

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.con.connect()
        self.cursor = self.con.cursor

    @staticmethod
    def add_course_data_to_sub(course_type: str):
        """Add datas to the Inter, Special, Normal tables."""
        filtered_data = CourseData.objects.filter(course_type=course_type)

        for course in filtered_data:
            course_instance = CourseData.objects.get(id=course.id)
            Inter.objects.create(course=course_instance)
            print(f"Inserted: {course_instance}")
        print("Successfully Saved in MySQL server\n")


class DatabaseBackup:
    """Class for database backup."""

    def __init__(self):
        """Define attributes."""
        self.data = None
        self.con = MySQLConnection()
        self.cursor = None

        self.table_name = [
                           "History", "BookMark",
                           "QAQuestionUpvote", "QAAnswerUpvote",
                           "QAAnswer", "QAQuestion",
                           "Note", "UpvoteStat", "History",
                           "ReviewStat", "CourseReview",
                           "FollowData", "UserData", "Inter", "Normal",
                           "Special", "CourseData"]

    def connect(self):
        """Connect to MySQL server and initialize cursor."""
        self.con.connect()
        self.cursor = self.con.cursor

    @staticmethod
    def check_date():
        """Check is it time to back up?."""
        with open('database/backup/logs.json', 'r',
                  encoding='UTF-8') as log_file:
            last_updated = datetime.strptime(
                json.load(log_file)['last-updated'], "%Y-%m-%d").date()

        if (datetime.now().date() - last_updated).days >= 7:
            return True
        return False

    def local_backup(self):
        """Pull all data from MySQL server to local every week."""
        if not self.check_date():
            self.connect()

            try:
                for table in self.table_name:
                    self.cursor.execute(f"SELECT * FROM {table}")
                    rows = self.cursor.fetchall()
                    columns = [desc[0] for desc in self.cursor.description]

                    print(rows)
                    # Convert rows into a list of dictionaries
                    data = []
                    for row in rows:
                        row_dict = {}
                        for idx, value in enumerate(row.values()):
                            # Convert datetime to string format
                            if isinstance(value, datetime):
                                value = value.isoformat()

                            row_dict[columns[idx]] = value
                        data.append(row_dict)

                    # Write the JSON file in the backup folder
                    with open(f"./database/backup/{table.lower()}_data.json",
                              "w", encoding='UTF-8') as overwrite_file:
                        json.dump(data, overwrite_file, ensure_ascii=False, indent=4)
                    print(f"Data saved to database/backup/"
                          f"{table.lower()}_data.json")

            finally:
                self.con.close()

            with open('database/backup/logs.json', 'w',
                      encoding='UTF-8') as log_file:
                json.dump({"last-updated": str(datetime.now().date())},
                          log_file, ensure_ascii=False, indent=4)
            print("Data saved to database/backup/logs.json")

    def exist_data_loader(self, course_type: str):
        """Combine all data in the folder and separate by course programs."""
        with open(f"./database/scraped_data/{course_type}2.json",
                  "r", encoding="UTF-8") as file:
            second_semester = json.load(file)
        with open(f"./database/scraped_data/{course_type}1.json",
                  "r", encoding="UTF-8") as file:
            first_semester = json.load(file)

        all_faculty = {}
        for key, vals in second_semester.items():
            all_faculty[key] = vals

        for key, vals in first_semester.items():
            all_faculty[key] = vals

        self.data = all_faculty

    def insert_data_to_remote(self, course_type):
        """Insert the backup database to the database server."""
        self.connect()

        try:
            print(self.data)
            for course_id, course_name in self.data.items():
                self.cursor.execute(
                    "INSERT INTO CourseData (course_id,\
                        course_type, course_name) "
                    "VALUES (%s, %s, %s)", (course_id,
                                                course_type, course_name)
                )
                print(course_id, course_type, course_name)
                print("Inserting...\n")

            self.con.connection.commit()

            print("Successfully Saved in MySQL server\n")

        finally:

            self.con.close()
