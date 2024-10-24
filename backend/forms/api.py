"""This module use for send the data from Django to Next.js."""

import logging
from webbrowser import Error

from ninja.responses import Response
from ninja_extra import NinjaExtraAPI
from google.oauth2 import id_token
from google.auth.transport import requests
from ninja import Schema
from decouple import config
from backend.forms.schemas import UserDataSchema

from .models import UserData
from .schemas import CourseReviewSchema
from .db_management import DatabaseBackup
from .db_post import PostFactory
from .db_query import DatabaseQuery, QueryFactory

app = NinjaExtraAPI()


def verify_google_token(auth: str, email: str) -> bool:
    """Verify the Google OAuth token from the frontend."""
    try:
        token = auth.split(" ")[1]
        check_token = id_token.verify_oauth2_token(token, requests.Request(), config('GOOGLE_CLIENT_ID', cast=str,
                        default='sif'))

        if check_token['email'] == email:
            return True
        else:
            return False

    except ValueError:
        return False

logger = logging.getLogger("user_logger")

@app.get("/database/course_data")
def database(request):
    """Use for send the data to frontend."""
    print(request)

    return Response(DatabaseQuery().send_all_course_data())

@app.get("/database/sorted_data")
def get_sorted_data(request):
    """Use for send sorted data to frontend."""

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
        email = request.headers.get("email")

        if verify_google_token(auth_header, email):
            return Response(DatabaseQuery().send_all_course_data())
        else:
            return Response({"error": "Invalid token"}, status=403)

    except (IndexError, KeyError):
        return Response({"error": "Malformed or invalid token"}, status=401)

class UserCreateSchema(Schema):
    name: str
    email: str

@app.post("/create/user")
def create_user(request, data: UserCreateSchema):
    """Use for create new user."""
    if not UserData.objects.filter(email=data.email):
        UserData.objects.create(user_name=data.user_name, user_type=data.user_type, email=data.email)
        logger.debug(f'created user: {data.user_name} {data.email}')
    logger.debug(f'user: {data.user_name} {data.email}')

@app.post("/create/review", response={200: CourseReviewSchema})
def create_review(request, data: CourseReviewSchema):
    """Use for create new review."""
    strategy = PostFactory.get_post_strategy("review")
    strategy.post_data(data.model_dump())

def backup(request):
    """Use for download data from MySQL server to local"""
    print(request)

    DatabaseBackup().local_backup()
