"""This module use for send the data from Django to Next.js."""

import pymysql

from ninja import NinjaAPI
from decouple import config
from .db_management import DatabaseManagement, MySQLConnection

api = NinjaAPI()


@api.get(config('DJANGO_API_ENDPOINT',
                cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseManagement(MySQLConnection()).send_all_course_data()
