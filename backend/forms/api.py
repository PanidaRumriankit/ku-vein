"""This module use for send the data from Django to Next.js."""

import logging
from ninja.responses import Response
from ninja_extra import NinjaExtraAPI
from google.oauth2 import id_token
from google.auth.transport import requests
from ninja import Schema
from decouple import config

from .models import UserData
from .db_management import DatabaseBackup
from .db_query import DatabaseQuery, QueryFactory

app = NinjaExtraAPI()


def verify_google_token(token: str):
    """Verify the Google OAuth token from the frontend."""
    try:
        is_valid = id_token.verify_oauth2_token(token, requests.Request(), config('GOOGLE_CLIENT_ID', cast=str,
                        default='sif'))
        return is_valid

    except ValueError:
        return Response({"error": "Invalid token"}, status=401)

logger = logging.getLogger("user_logger")

@app.get("/database/course_data")
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return Response(DatabaseQuery().send_all_course_data())

@app.get("/database/sorted_data")
def get_sorted_data(request):
    query = request.GET.get("query")

    if not query:
        return Response({"error": "Query parameter missing"}, status=400)

    elif query not in ["earliest", "latest", "upvote"]:
        return Response({"error": "Invalid Query parameter"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy(query)
        return Response(strategy.get_data())

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

@app.get("/database/cou")
def test_auth(request):
    """For test API authentication only."""

    auth_header = request.headers.get("Authorization")

    if auth_header is None:
        return Response({"error": "Authorization header missing"}, status=401)

    try:
        token = auth_header.split(" ")[1]
        email = request.headers.get("email")

        check_token = verify_google_token(token)

        if check_token['email'] == email:
            return Response(DatabaseQuery().send_all_course_data())
        else:
            return Response({"error": "Invalid token"}, status=403)

    except (IndexError, KeyError):
        return Response({"error": "Malformed or invalid token"}, status=401)


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
