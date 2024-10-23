"""This module use for send the data from Django to Next.js."""

from ninja import NinjaAPI, Schema
from decouple import config
from .db_management import DatabaseManagement, MySQLConnection, DatabaseBackup
from backend.forms.schemas import CourseDataSchema
from .models import UserData
from django.contrib.auth import authenticate, login
import logging
from .db_management import DatabaseBackup
from .db_query import DatabaseQuery

app = NinjaAPI()

logger = logging.getLogger("user_logger")

@app.get(config('DJANGO_API_ENDPOINT',
                cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseQuery().send_all_course_data()


class UserCreateSchema(Schema):
    name: str
    email: str

@app.post('/create_user/')
def create_user(request, data: UserCreateSchema):
    if not UserData.objects.filter(email=data.email):
        UserData.objects.create(user_name=data.name, user_type='student', email=data.email)
        logger.debug(f'created user: {data.name} {data.email}')
    logger.debug(f'user: {data.name} {data.email}')

def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup().local_backup()
