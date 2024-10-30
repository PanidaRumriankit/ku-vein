"""This module use for send the data from Django to Next.js."""

from ninja.responses import Response
from ninja_extra import NinjaExtraAPI
from google.oauth2 import id_token
from google.auth.transport import requests
from decouple import config

from .schemas import ReviewRequestSchema, UserDataCreateSchema
from .db_management import DatabaseBackup
from .db_post import PostFactory
from .db_query import QueryFactory, InterQuery

app = NinjaExtraAPI()


def verify_google_token(auth: str, email: str) -> bool:
    """Verify the Google OAuth token from the frontend."""
    try:
        token = auth.split(" ")[1]
        check_token = id_token.verify_oauth2_token(token, requests.Request(),
                                                   config('GOOGLE_CLIENT_ID',
                                                          cast=str,
                                                          default='sif'))

        if check_token['email'] == email:
            return True
        else:
            return False

    except ValueError:
        return False


@app.get("/course")
def get_course_data(request):
    """Use for send the data to frontend."""
    print(request)

    course_type = request.GET.get("type")

    if not course_type:
        course_type = "none"

    elif course_type.lower() not in ["inter", "special", "normal"]:
        return Response({"error": "Invalid Query parameter"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy(course_type)
        return Response(strategy.get_data())

    except ValueError as e:
        return Response({"error": str(e)}, status=400)


@app.get("/review")
def get_sorted_data(request):
    """Use for send sorted data to frontend."""
    sort = request.GET.get("sort")
    if not sort:
        return Response({"error": "Query parameter missing"}, status=400)

    elif sort not in ["earliest", "latest", "upvote"]:
        return Response({"error": "Invalid Query parameter"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy(sort)
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
            return Response(InterQuery().get_data())
        else:
            return Response({"error": "Invalid token"}, status=403)

    except (IndexError, KeyError):
        return Response({"error": "Malformed or invalid token"}, status=401)


@app.post("/user")
def create_user(request, data: UserDataCreateSchema):
    """Use for create new user."""
    strategy = PostFactory.get_post_strategy("user")
    strategy.post_data(data.model_dump())


@app.post("/review", response={200: ReviewRequestSchema})
def create_review(request, data: ReviewRequestSchema):
    """Use for create new review."""
    strategy = PostFactory.get_post_strategy("review")
    return strategy.post_data(data.model_dump())


def backup(request):
    """Use for download data from MySQL server to local."""
    print(request)
    DatabaseBackup().local_backup()
