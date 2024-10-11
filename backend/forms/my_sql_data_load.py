"""
Add data from database to mysql server database
use normal2.json to try
"""

import pymysql
import json
import os
from decouple import config

timeout = 10
connection = pymysql.connect(
  charset="utf8mb4",
  connect_timeout=timeout,
  cursorclass=pymysql.cursors.DictCursor,
  db="defaultdb",
  host="ku-vein-mysql-db-ku-vein.b.aivencloud.com",
  password=config('MYSQLPASS', cast=str,
                  default='oranutansunbathinginthebananapool'),
  read_timeout=timeout,
  port=22924,
  user=config('MYSQLUSER', cast=str,
                  default='harambe'),
  write_timeout=timeout,
)

DATA_DIR = os.path.dirname(__file__) + '/database'
files = os.listdir(DATA_DIR)

try:
    cursor = connection.cursor()
    cursor.execute("DROP TABLE IF EXISTS Course")
    for file in files:
        path = DATA_DIR + '/' + file
        with open(path, 'r') as f:
            data = json.load(f)
            for fac, subjs in data.items():
                for sub in subjs.items():

finally:
    connection.close()


# try:
#     cursor = connection.cursor()
#     cursor.execute("DROP TABLE IF EXISTS Course")
#     cursor.execute("CREATE TABLE mytest (id INTEGER PRIMARY KEY)")
#     cursor.execute("INSERT INTO mytest (id) VALUES (1), (2)")
#     cursor.execute("SELECT * FROM mytest")
#     print(cursor.fetchall())
# finally:
#     connection.close()
