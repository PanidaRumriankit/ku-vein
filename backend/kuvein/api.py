"""This module use for send the data from Django to Next.js."""

import pymysql

from ninja import NinjaAPI
from decouple import config

api = NinjaAPI()


@api.get(config('DJANGO_API_ENDPOINT',
                cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    """Use for send the data to frontend."""
    print(request)

    timeout = 10
    connection = pymysql.connect(
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

    try:
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS mytest")
        cursor.execute("CREATE TABLE mytest (id INTEGER PRIMARY KEY)")
        cursor.execute("INSERT INTO mytest (id) VALUES (1), (2)")
        cursor.execute("SELECT * FROM mytest")
        send_data = cursor.fetchall()
        return send_data

    finally:
        connection.close()
