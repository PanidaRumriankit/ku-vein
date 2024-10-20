"""This module use for send the data from Django to Next.js."""

from ninja import NinjaAPI
from decouple import config
from .db_management import DatabaseBackup
from .db_query import DatabaseQuery

app = NinjaAPI()


@app.get(config('DJANGO_API_ENDPOINT',
                cast=str, default='for_the_dark_souls.ptt'))
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseQuery().send_all_course_data()


def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup().local_backup()
