"""This module use for send the data from Django to Next.js."""

from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from .db_management import DatabaseBackup
from .db_query import DatabaseQuery

app = NinjaExtraAPI()
app.register_controllers(NinjaJWTDefaultController)


@app.get("/database/course_data")
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return DatabaseQuery().send_all_course_data()


def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup().local_backup()
