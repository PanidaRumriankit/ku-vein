"""This module use for send the data from Django to Next.js."""

from ninja.responses import Response
from ninja_extra import NinjaExtraAPI
from google.oauth2 import id_token
from google.auth.transport import requests
from decouple import config

from .db_management import DatabaseBackup
from .db_query import DatabaseQuery

app = NinjaExtraAPI()


def verify_google_token(token: str):
    """Verify the Google OAuth token from the frontend."""
    try:
        is_valid = id_token.verify_oauth2_token(token, requests.Request(), config('GOOGLE_CLIENT_ID', cast=str,
                        default='sif'))
        return is_valid

    except ValueError:
        return Response({"error": "Invalid token"}, status=401)

@app.get("/database/course_data")
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return Response(DatabaseQuery().send_all_course_data())


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


def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup().local_backup()
