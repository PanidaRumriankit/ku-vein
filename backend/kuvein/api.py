import pymysql
from decouple import config

from ninja import NinjaAPI, Schema
from decouple import config

api = NinjaAPI()

class UserSchema(Schema):
    username: str
    is_authenticated: bool
    email: str = None

@api.get(config('DJANGO_API_ENDPOINT', cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    print(request)

    timeout = 10
    connection = pymysql.connect(
        charset="utf8mb4",
        connect_timeout=timeout,
        cursorclass=pymysql.cursors.DictCursor,
        db="defaultdb",
        host="ku-vein-mysql-db-ku-vein.b.aivencloud.com",
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

# Implement incase doing the account feature in the future
@api.get('/me', response=UserSchema)
def me(request):
    return request.user