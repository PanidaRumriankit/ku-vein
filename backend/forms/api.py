"""This module use for send the data from Django to Next.js."""
from decouple import config
from google.auth.transport import requests
from google.oauth2 import id_token
from ninja.responses import Response
from ninja_extra import (ControllerBase, api_controller, http_put,
                         http_get, http_post, http_delete)
from ninja_extra import NinjaExtraAPI

from .db_delete import DeleteFactory
from .db_management import DatabaseBackup
from .db_post import PostFactory
from .db_put import PutFactory
from .db_query import QueryFactory, InterQuery
from .schemas import (ReviewPostSchema, ReviewPutSchema,
                      ReviewDeleteSchema, UserProfileSchema,
                      UpvotePostSchema,
                      FollowSchema,
                      UserDataSchema, UserDataEditSchema,
                      NotePostSchema, NotePutSchema,
                      NoteDeleteSchema,
                      BookMarkSchema,
                      QuestionCreateSchema, QuestionPutSchema,
                      QuestionDeleteSchema, QuestionUpvoteSchema,
                      AnswerCreateSchema, AnswerPutSchema,
                      AnswerDeleteSchema, AnswerUpvoteSchema,
                      QA_Upvote_Get)
from .db_management import DatabaseBackup
from .db_post import PostFactory
from .db_query import QueryFactory, InterQuery
from .db_put import PutFactory


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

def check_real_user(req_header):
    """Check is email of token equal to email send from frontend."""
    # TODO: remove comment
    # token, email = req_header.headers.get('Authorization'), req_header.headers.get('email')
    # if token is None:
    #     return Response({"error": "Authorization header missing"}, status=401)

    # if email is None:
    #     return Response({"error": "Email header is missing"}, status=401)

    # try:
    #     if verify_google_token(token, email):
    #         return True
    #     else:
    #         return Response({"error": "Invalid token"}, status=403)

    # except (IndexError, KeyError):
    #     return Response({"error": "Malformed or invalid token"}, status=401)
    pass

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


@api_controller("/course")
class CourseController(ControllerBase):
    """Controller for handling Course endpoints."""

    @http_get("")
    def get_course_data(self, request, course_type=None):
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


@api_controller("/follow")
class FollowController(ControllerBase):
    """Controller for handling Follow endpoints."""

    @http_post("", response={200: FollowSchema})
    def add_follower(self, request, data: FollowSchema):
        """Use for add new follower to the database."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("follow")
        return strategy.post_data(data.model_dump())


@api_controller("/review")
class ReviewController(ControllerBase):
    """Controller for handling Review endpoints."""

    @http_get("")
    def get_sorted_data(self, request, sort="latest", course_id=None, review_id=None):
        """Use for send sorted data to frontend."""
        filter_key = {"sort": sort, "course_id": course_id,
                      "review_id": review_id}

        if sort not in ["earliest", "latest", "upvote"]:
            return Response({"error": "Invalid Sort parameter"}, status=400)

        try:
            strategy = QueryFactory.get_query_strategy("sort")
            return check_response(
                strategy.get_data(filter_key=filter_key))

        except ValueError as e:
            return Response({"error": str(e)}, status=400)


    @http_post("", response={200: ReviewPostSchema})
    def create_review(self, request, data: ReviewPostSchema):
        """Use for create new review."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("review")
        return strategy.post_data(data.model_dump())


    @http_put("", response={200: ReviewPutSchema})
    def edit_review(self, request, data: ReviewPutSchema):
        """Edit review data."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PutFactory.get_put_strategy("review")
        return strategy.put_data(data.model_dump())

    @http_delete("", response={200: ReviewDeleteSchema})
    def delete_review(self, request, data: ReviewDeleteSchema):
        """Delete the review objects."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = DeleteFactory.get_delete_strategy("review")
        return strategy.delete_data(data.model_dump())

    @http_get("/stats")
    def get_stat_data(self, request, course_id):
        """Use for send review stats data to frontend."""

        if not course_id:
            return Response({"error": "Missing course_id parameter"},
                            status=400)

        try:
            strategy = QueryFactory.get_query_strategy("review-stat")
            return check_response(strategy.get_data(filter_by=course_id))

        except ValueError as e:
            return Response({"error": str(e)}, status=400)


@api_controller("/user")
class UserController(ControllerBase):
    """Controller for handling User endpoints."""

    @http_get("")
    def get_user(self, request, email=None, user_id=None, user_name=None):
        """Use for send the username and user id to the frontend."""
        if not email and not user_id and not user_name:
            return Response({"error": "Data for parameter is missing"},
                            status=400)

        try:
            strategy = QueryFactory.get_query_strategy("user")
            return check_response(
                strategy.get_data({"email": email, "user_id": user_id, "user_name": user_name}))

        except ValueError as e:
            return Response({"error": str(e)}, status=400)

    @http_post("", response={200: UserDataSchema})
    def create_user(self, request, data: UserDataSchema):
        """Use for create new user."""
        strategy = PostFactory.get_post_strategy("user")
        return strategy.post_data(data.model_dump())

    @http_put("")
    def edit_user(self, request, data: UserDataEditSchema):
        """Edit data for the user."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PutFactory.get_put_strategy("user")
        return strategy.put_data(data.model_dump())

    @http_post("/profile", response={200: UserProfileSchema})
    def add_new_profile_pic(self, request, data: UserProfileSchema):
        """Use for create new profile"""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("profile")
        return strategy.post_data(data.model_dump())

    @http_put("/profile", response={200: UserProfileSchema})
    def change_profile_pic(self, request, data: UserProfileSchema):
        """Use for change the profile"""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PutFactory.get_put_strategy("profile")
        return strategy.put_data(data.model_dump())


@api_controller("/note")
class NoteController(ControllerBase):
    """Controller for handling Note endpoints."""

    @http_get("")
    def get_note_data(self, request, email: str = None, course_id: str = None,
                      faculty: str = None):
        """Use for send the note data to the frontend"""
        filter_key = {"email": email, "course_id": course_id,
                      "faculty": faculty}

        try:
            strategy = QueryFactory.get_query_strategy("note")
            return check_response(strategy.get_data(filter_key))

        except ValueError as e:
            return Response({"error": str(e)}, status=400)

    @http_post("", response={200: NotePostSchema})
    def add_note(self, request, data: NotePostSchema):
        """Use for add new Note object."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("note")
        return strategy.post_data(data.model_dump())
    
    @http_put("")
    def edit_question(self, request, data: NotePutSchema):
        """Edit Note data."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PutFactory.get_put_strategy("note")
        return strategy.put_data(data.model_dump())

    @http_delete("", response={200: NoteDeleteSchema})
    def delete_note(self, request, data: NoteDeleteSchema):
        """Delete the note objects."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = DeleteFactory.get_delete_strategy("note")
        return strategy.delete_data(data.model_dump())


@api_controller("/upvote")
class UpvoteController(ControllerBase):
    """Controller for handling Upvote endpoints."""

    @http_get("")
    def is_upvote(self, request, email: str, review_id: int):
        """Check is the user already like the review."""
        if not email:
            return Response({"error": "Missing email parameter."},
                            status=401)
        elif not review_id:
            return Response({"error": "Missing review_id parameter."},
                            status=401)

        strategy = QueryFactory.get_query_strategy("upvote")
        return check_response(
            strategy.get_data({"email": email, "review_id": review_id}))

    @http_post("", response={200: UpvotePostSchema})
    def add_upvote(self, request, data: UpvotePostSchema):
        """Use for add new upvote."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("review_upvote")
        return strategy.post_data(data.model_dump())


@api_controller("/book")
class BookMarkController(ControllerBase):
    """Controller for handling Upvote endpoints."""

    @http_get("")
    def get_bookmark_data(self, request, email: str):
        """Use for send the note data to the frontend"""
        if not email:
            return Response({"error": "Missing email parameter."},
                            status=401)
        strategy = QueryFactory.get_query_strategy("book")
        return check_response(strategy.get_data(email))

    @http_post("", response={200: BookMarkSchema})
    def add_bookmark(self, request, data: BookMarkSchema):
        """Use for add new bookmark object."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("book")
        return strategy.post_data(data.model_dump())


@api_controller("/history")
class HistoryController(ControllerBase):
    """Controller for handling History endpoints."""

    @http_get("")
    def get_bookmark_data(self, request, target_user: str, is_other_user: bool):
        """Use for send the note data to the frontend"""
        if not target_user:
            return Response({"error": "Missing email parameter."},
                            status=401)
        strategy = QueryFactory.get_query_strategy("history")
        return check_response(strategy.get_data(target_user, is_other_user))


@api_controller("/qa")
class QuestionController(ControllerBase):
    """Controller for handling qa endpoints."""

    @http_get("")
    def get_question(self, request, course_id: str|None=None, mode: str='latest'):
        """Get all Question or Answers to a Q&A."""
        strategy = QueryFactory.get_query_strategy("qa_question")
        return strategy.get_data(course_id=course_id, mode=mode)

    @http_post("")
    def add_question(self, request, data: QuestionCreateSchema):
        """Use for creating new question for Q&A."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("question")
        return strategy.post_data(data.model_dump())
    
    @http_put("")
    def edit_question(self, request, data: QuestionPutSchema):
        """Edit QA_Questions data."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PutFactory.get_put_strategy("question")
        return strategy.put_data(data.model_dump())
    
    @http_get("/upvote")
    def is_q_upvote(self, request, email: str, qa_id: int):
        """Check is the user already like the question."""
        if not email:
            return Response({"error": "Missing email parameter."},
                            status=401)
        elif not qa_id:
            return Response({"error": "Missing qa_id parameter."},
                            status=401)

        strategy = QueryFactory.get_query_strategy("question_upvote")
        return check_response(
            strategy.get_data({"email": email, "qa_id": qa_id}))

    @http_post("/upvote")
    def upvote_question(self, request, data: QuestionUpvoteSchema):
        """Use for creating new upvote for Q&A."""
        correct_user = check_real_user(data)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("question_upvote")
        return strategy.post_data(data.model_dump())
    
    @http_delete("", response={200: QuestionDeleteSchema})
    def delete_question(self, request, data: QuestionDeleteSchema):
        """Delete the question objects."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = DeleteFactory.get_delete_strategy("question")
        return strategy.delete_data(data.model_dump())


@api_controller("/qa/answer")
class AnswerController(ControllerBase):
    """Controller for handling qa endpoints."""

    @http_get("")
    def get_answer(self, request, question_id, mode='latest'):
        strategy = QueryFactory.get_query_strategy("qa_answer")
        return strategy.get_data(question_id=question_id, mode=mode)

    @http_post("")
    def add_answer(self, request, data: AnswerCreateSchema):
        """Use for creating new answer for Q&A."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("answer")
        return strategy.post_data(data.model_dump())
    
    @http_put("")
    def edit_answer(self, request, data: AnswerPutSchema):
        """Edit QA_Answers data."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PutFactory.get_put_strategy("answer")
        return strategy.put_data(data.model_dump())
    
    @http_delete("", response={200: AnswerDeleteSchema})
    def delete_answer(self, request, data: AnswerDeleteSchema):
        """Delete the answer objects."""
        correct_user = check_real_user(request)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = DeleteFactory.get_delete_strategy("answer")
        return strategy.delete_data(data.model_dump())
    
    @http_get("/upvote")
    def is_a_upvote(self, request, email: str, qa_id: int):
        """Check is the user already like the answer."""
        if not email:
            return Response({"error": "Missing email parameter."},
                            status=401)
        elif not qa_id:
            return Response({"error": "Missing qa_id parameter."},
                            status=401)

        strategy = QueryFactory.get_query_strategy("answer_upvote")
        return check_response(
            strategy.get_data({"email": email, "qa_id": qa_id}))

    @http_post("/upvote")
    def upvote_answer(self, request, data: AnswerUpvoteSchema):
        """Use for creating new upvote for Q&A."""
        correct_user = check_real_user(data)
        if isinstance(correct_user, Response):
            return correct_user
        strategy = PostFactory.get_post_strategy("answer_upvote")
        return strategy.post_data(data.model_dump())


@api_controller("/backup")
class BackUpController(ControllerBase):
    """Controller for handling Backup endpoints."""

    @http_post("")
    def backup(self, request):
        """Use for download data from MySQL server to local server."""
        print(request)
        if DatabaseBackup().local_backup():
            return Response({"success": "Backup is done."},
                            status=202)
        return Response({"success": "But the system does not require a backup right now."},
                            status=202)
