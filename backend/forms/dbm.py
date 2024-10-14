import json
import pymysql

from decouple import config

class DatabaseManagement:
    def __init__(self):
        self.data = None
        self.connection = None
        self.cursor = None

        self.table_name = ['BookMark', 'QA', 'Summary', 'CourseReview', 'UserData', 'ReviewStat', 'CourseData']
        self.exist_data_loader()

    def connect_mysql_server(self):
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

    def table_initialize(self):
        """Create table in MySQL server."""

        self.connect_mysql_server()

        try:

            self.drop_all_table()
            self.cursor.execute("CREATE TABLE CourseData(course_id INT, faculty VARCHAR(100),"
                           " course_name LONGTEXT, PRIMARY KEY (course_id, faculty))")

            self.cursor.execute("CREATE TABLE ReviewStat(review_id INT, course_id INT, "
                           "date_data DATE, grade CHAR(1), upvotes INT, "
                           "PRIMARY KEY (review_id), "
                           "FOREIGN KEY (course_id) REFERENCES CourseData(course_id) ON DELETE CASCADE)")

            self.cursor.execute("CREATE TABLE UserData(user_id INT UNIQUE, user_name VARCHAR(30) UNIQUE, "
                           "user_type VARCHAR(20), email LONGTEXT, PRIMARY KEY (user_id))")

            self.cursor.execute("CREATE TABLE CourseReview(review_id INT UNIQUE, user_id INT, course_id INT,"
                           " reviews LONGTEXT, PRIMARY KEY (user_id, course_id),"
                           " FOREIGN KEY (user_id) REFERENCES UserData(user_id) ON DELETE CASCADE,"
                           " FOREIGN KEY (course_id) REFERENCES CourseData(course_id) ON DELETE CASCADE)")

            self.cursor.execute("CREATE TABLE Summary(course_id INT, user_id INT, sum_text LONGTEXT,"
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

    def drop_all_table(self):
        """Drop every table in the database."""
        for drop in self.table_name:
            self.cursor.execute(f"DROP TABLE IF EXISTS {drop}")


    def exist_data_loader(self):
        """Combined all the data and separate by course programs."""
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


    def insert_course_data(self):
        """Used for insert database to the database server."""

        self.table_initialize()
        self.connect_mysql_server()

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
        finally:
            self.connection.close()



d = DatabaseManagement()

d.insert_course_data()
