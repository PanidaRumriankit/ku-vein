"""This module use for send the data from Django to Next.js."""
from decouple import config
from google.auth.transport import requests
from google.oauth2 import id_token
from ninja.responses import Response
from ninja_extra import NinjaExtraAPI

from .db_management import DatabaseBackup
from .db_post import PostFactory
from .db_put import PutFactory
from .db_query import QueryFactory, InterQuery
from .schemas import (ReviewPostSchema, UserDataSchema,
                      UpvotePostSchema, FollowSchema,
                      UserDataEditSchema, NotePostSchema, BookMarkSchema)

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

def check_response(data):
    """
    Use for return data.

    If it isn't response instance.
    It will create Response object and return.
    """
    if isinstance(data, Response):
        return data
    else:
        return Response(data, status=200)


@app.get("/course")
def get_course_data(request, course_type=None):
    """Use for send the data to frontend."""
    print(request)

    query_type = course_type

    if not query_type:
        query_type = "none"

    elif query_type.lower() not in ["inter", "special", "normal"]:
        return Response({"error": "Invalid type parameter"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy(query_type)
        return check_response(strategy.get_data())

    except ValueError as e:
        return Response({"error": str(e)}, status=400)


@app.get("/review")
def get_sorted_data(request, sort, course_id=None):
    """Use for send sorted data to frontend."""

    if sort not in ["earliest", "latest", "upvote"]:
        return Response({"error": "Invalid Sort parameter"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy("sort")
        return check_response(strategy.get_data(order_by=sort, filter_by=course_id))

    except ValueError as e:
        return Response({"error": str(e)}, status=400)


@app.get("/review/stats")
def get_stat_data(request, course_id):
    """Use for send review stats data to frontend."""

    if not course_id:
        return Response({"error": "Missing course_id parameter"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy("review-stat")
        return check_response(strategy.get_data(filter_by=course_id))

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


@app.get("/user")
def get_user(request, email=None, user_id=None):
    """Use for send the username and user id to the frontend."""
    if not email and not user_id:
        return Response({"error": "Data for parameter is missing"}, status=400)

    try:
        strategy = QueryFactory.get_query_strategy("user")
        return check_response(strategy.get_data({"email": email, "user_id": user_id}))

    except ValueError as e:
        return Response({"error": str(e)}, status=400)


@app.get("/note")
def get_note_data(request, email: str = None, course_id: str = None,
                  course_type: str = None, faculty: str = None):
    """Use for send the note data to the frontend"""
    if not email and not course_id and not faculty and not course_type:
        return Response({"error": "Missing parameter."}, status=401)

    filter_key = {"email": email, "course_id": course_id,
                  "faculty": faculty, "course_type": course_type}

    try:
        strategy = QueryFactory.get_query_strategy("note")
        return check_response(strategy.get_data(filter_key))

    except ValueError as e:
        return Response({"error": str(e)}, status=400)


@app.get("/upvote")
def is_upvote(request, email: str, review_id: int):
    """Check is the user already like the review."""
    if not email:
        return Response({"error": "Missing email parameter."},
                        status=401)
    elif not review_id:
        return Response({"error": "Missing review_id parameter."},
                        status=401)

    strategy = QueryFactory.get_query_strategy("upvote")
    return check_response(strategy.get_data({"email": email, "review_id": review_id}))


@app.get("/book")
def get_bookmark_data(request, email: str):
    """Use for send the note data to the frontend"""
    if not email:
        return Response({"error": "Missing email parameter."},
                        status=401)
    strategy = QueryFactory.get_query_strategy("book")
    return check_response(strategy.get_data(email))


@app.put("/user")
def change_username(request, data: UserDataEditSchema):
    """Change username for the user."""
    strategy = PutFactory.get_put_strategy("user")
    return strategy.put_data(data.model_dump())


@app.post("/user")
def create_user(request, data: UserDataSchema):
    """Use for create new user."""
    strategy = PostFactory.get_post_strategy("user")
    return strategy.post_data(data.model_dump())


@app.post("/follow", response={200: FollowSchema})
def add_follower(request, data: FollowSchema):
    """Use for add new follower to the database."""
    strategy = PostFactory.get_post_strategy("follow")
    return strategy.post_data(data.model_dump())


@app.post("/review", response={200: ReviewPostSchema})
def create_review(request, data: ReviewPostSchema):
    """Use for create new review."""
    strategy = PostFactory.get_post_strategy("review")
    return strategy.post_data(data.model_dump())


@app.post("/upvote", response={200: UpvotePostSchema})
def add_upvote(request, data: UpvotePostSchema):
    """Use for add new upvote."""
    strategy = PostFactory.get_post_strategy("upvote")
    return strategy.post_data(data.model_dump())


@app.post("/note", response={200: NotePostSchema})
def add_note(request, data: NotePostSchema):
    """Use for add new Note object."""
    strategy = PostFactory.get_post_strategy("note")
    return strategy.post_data(data.model_dump())


@app.post("/book", response={200: BookMarkSchema})
def add_bookmark(request, data: BookMarkSchema):
    """Use for add new bookmark object."""
    strategy = PostFactory.get_post_strategy("book")
    return strategy.post_data(data.model_dump())


def backup(request):
    """Use for download data from MySQL server to local."""
    print(request)
    DatabaseBackup().local_backup()
