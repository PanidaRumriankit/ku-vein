"""
Sample file to test connection to mysql hosting service.
Run this file by using this command

```
python3 Backend/sample_mysql_conn.py
```

Expected output
```
[{'id': 1}, {'id': 2}]
```
"""

import pymysql
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
  user="avnadmin",
  write_timeout=timeout,
)

try:
    cursor = connection.cursor()
    cursor.execute("DROP TABLE IF EXISTS mytest")
    cursor.execute("CREATE TABLE mytest (id INTEGER PRIMARY KEY)")
    cursor.execute("INSERT INTO mytest (id) VALUES (1), (2)")
    cursor.execute("SELECT * FROM mytest")
    print(cursor.fetchall())
finally:
    connection.close()