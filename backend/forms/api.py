"""This module use for send the data from Django to Next.js."""

from ninja import NinjaAPI
from decouple import config
from .db_management import DatabaseManagement, MySQLConnection, DatabaseBackup
from backend.forms.schemas import CourseDataSchema

app = NinjaAPI()
connect = MySQLConnection()


@app.get(config('DJANGO_API_ENDPOINT',
         cast=str, default='for_the_dark_souls.ptt'),
         response=list[CourseDataSchema])
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseManagement(connect).send_all_course_data()


def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup(connect).local_backup()
