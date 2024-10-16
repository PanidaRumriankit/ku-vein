"""This module use for send the data from Django to Next.js."""

from ninja import NinjaAPI, Schema, ModelSchema
from decouple import config
from .db_management import DatabaseManagement, MySQLConnection, DatabaseBackup

api = NinjaAPI()
connect = MySQLConnection()


@api.get(config('DJANGO_API_ENDPOINT',
                cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseManagement(connect).send_all_course_data()

def login(request, email: str = "Unauthorized"):
    print(f"Hello {email}!")

def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup(connect).local_backup()
