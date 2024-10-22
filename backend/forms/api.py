"""This module use for send the data from Django to Next.js."""

from ninja import NinjaAPI
from decouple import config
from .db_management import DatabaseManagement, MySQLConnection, DatabaseBackup
from backend.forms.schemas import CourseDataSchema
from .models import UserData
from django.contrib.auth import authenticate, login
import logging

app = NinjaAPI()
connect = MySQLConnection()

logger = logging.getLogger("user_logger")

@app.get(config('DJANGO_API_ENDPOINT',
         cast=str, default='for_the_dark_souls.ptt'),
         response=list[CourseDataSchema])
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseManagement(connect).send_all_course_data()

@app.post('/create_user/')
def create_user(request, name: str, email: str):
    if not UserData.objects.filter(email=email):
        UserData.objects.create(user_name=name, user_type='student', email=email)
        logger.debug(f'created user: {name} {email}')
    logger.debug(f'user: {name} {email}')

def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)
    DatabaseBackup(connect).local_backup()