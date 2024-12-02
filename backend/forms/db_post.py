"""This module use for post and update database."""

import base64
import logging
import os
from abc import ABC, abstractmethod
from datetime import datetime

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from google.cloud import storage
from kuvein.settings import GOOGLE_CREDENTIAL
from ninja.responses import Response

from .models import (CourseReview, UserData,
                     CourseData, ReviewStat,
                     UpvoteStat, FollowData, Note,
                     QA_Question, QA_Answer,
                     QA_Question_Upvote, QA_Answer_Upvote,
                     BookMark, History, UserProfile)

logger = logging.getLogger("user_logger")


class PostStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def post_data(self, data: dict):
        """Update the data to the database."""
        pass


class UserDataPost(PostStrategy):
    """Class for created new UserData object."""

    def post_data(self, data: dict):
        """Add the data to the UserData."""
        try:
            UserData.objects.get(email=data['email'])

        except UserData.DoesNotExist:
            UserData.objects.create(
                user_name=f"user_{UserData.objects.count()}",
                user_type="student", email=data['email'])
            logger.debug(f"created user: user_{UserData.objects.count()}"
                         f" {data['email']}")
            return Response({"success": "The User is successfully created."},
                            status=201)

        except KeyError:
            return Response({"error": "email is missing "
                                      "from the request body."},
                            status=400)


class UserProfilePost(PostStrategy):
    """Class for created new UserProfile object."""

    def post_data(self, data: dict):
        """Collect the data from the frontend."""
        try:
            user = UserData.objects.get(user_id=data['user_id'])

            UserProfile.objects.create(
                user=user,
                img_id=data['img_id'],
                img_link=data['img_link'],
                img_delete_hash=data['img_delete_hash']
            )

        except KeyError:
            return Response({"error": "Missing data from the request body."},
                            status=400)

        except UserData.DoesNotExist:
            return Response({"error": "The User isn't in the database."},
                            status=401)

class ReviewPost(PostStrategy):
    """Class for created new CourseReview object."""

    def __init__(self):
        """Contain user and course instance."""
        self.user = None
        self.course = None

    def post_data(self, data: dict):
        """Add the data to the CourseReview."""
        error_check = self.get_instance(data)

        if isinstance(error_check, Response):
            return error_check

        try:
            anonymous = True
            if not data['pen_name']:
                data['pen_name'] = self.user.user_name

            if data['pen_name'] == self.user.user_name:
                anonymous = False

            if not data['academic_year']:
                data['academic_year'] = datetime.now().year

        except KeyError:
            return Response({"error": "pen_name or academic_year are missing"},
                            status=400)

        if CourseReview.objects.filter(
            user=self.user,
            course=self.course
        ).count() >= 3:
            return Response({"error": "User can't create"
                                      " the review of same course_id more than 3 times."},
                            status=405)

        review_instance = CourseReview.objects.create(
            user=self.user,
            course=self.course,
            reviews=data['reviews'],
            faculty=data['faculty'],
            instructor=data['instructor'],
            anonymous=anonymous
        )
        ReviewStat.objects.create(
            review=review_instance,
            rating=data['rating'],
            academic_year=data['academic_year'],
            pen_name=data['pen_name'],
            grade=data['grade'],
            effort=data['effort'],
            attendance=data['attendance'],
            scoring_criteria=data['scoring_criteria'],
            class_type=data['class_type'],
        )

        HistoryPost().post_data({
            "email": data['email'],
            "id": review_instance.review_id,
            "data_type": "review",
            "anonymous": anonymous
        })

        return Response({"success": "The Review is successfully created."},
                        status=201)

    def get_instance(self, data: dict):
        """Get the course and user instance."""
        try:
            self.user = UserData.objects.get(email=data['email'])
            self.course = CourseData.objects.get(
                course_id=data['course_id'],
                course_type=data['course_type'])
        except KeyError:
            return Response({"error": "UserData or CourseData are missing "
                                      "from the request body."}, status=400)

        except CourseData.DoesNotExist:
            return Response({"error": "This course isn't "
                                      "in the database."}, status=401)
        except UserData.DoesNotExist:
            return Response({"error": "This user isn't "
                                      "in the database."}, status=401)


class ReviewUpvotePost(PostStrategy):
    """Class for created new UpvoteStat object."""

    def __init__(self):
        """Contain user, course, and review_stat instance."""
        self.user = None
        self.course = None
        self.review_stat = None

    def post_data(self, data: dict):
        """Add the user to the UpvoteData."""
        error_check = self.get_instance(data)

        if isinstance(error_check, Response):
            return error_check

        return self.add_or_delete()

    def add_or_delete(self):
        """
        Check is the user already like or not.

        If already like. Then, unlike course review by delete the object.
        Else create new upvote objects.
        """
        exist = UpvoteStat.objects.filter(review_stat=self.review_stat,
                                          user=self.user)
        if exist.count():
            exist.delete()
            return Response({"success": "Successfully Unlike the Review."},
                            status=201)

        UpvoteStat.objects.create(review_stat=self.review_stat, user=self.user)

        return Response({"success": "Successfully Like the Review."},
                        status=201)

    def get_instance(self, data: dict):
        """Get the review_stat and user instance."""
        try:
            self.user = UserData.objects.get(email=data['email'])

            review = CourseReview.objects.get(
                review_id=data['review_id']
            )

            self.review_stat = ReviewStat.objects.get(
                review=review
            )

        except KeyError:
            return Response({"error": "UserData or ReviewData are missing "
                                      "from the request body."}, status=400)
        except UserData.DoesNotExist:
            return Response({"error": "This user isn't "
                                      "in the database."}, status=401)
        except CourseReview.DoesNotExist:
            return Response({"error": "This review isn't "
                                      "in the database."}, status=401)
        except ReviewStat.DoesNotExist:
            return Response({"error": "This review stat isn't "
                                      "in the database."}, status=401)


class FollowPost(PostStrategy):
    """Class for created new FollowData."""

    def __init__(self):
        """Contain user, course, and review_stat instance."""
        self.user = None
        self.target_user = None

    def post_data(self, data: dict):
        """Add new follower to the database."""
        try:
            self.user = UserData.objects.filter(
                user_id=data['current_user_id']
            ).first()

            self.target_user = UserData.objects.filter(
                user_id=data['target_user_id']
            ).first()

        except KeyError:
            return Response({"error": "current_user_id "
                                      "or target_user_id are missing "
                                      "from the request body."}, status=400)

        if not self.user:
            return Response({"error": "This user isn't "
                                      "in the database."}, status=401)
        elif not self.target_user:
            return Response({"error": "Target user isn't "
                                      "in the database."}, status=401)

        return self.add_or_delete()

    def add_or_delete(self):
        """
        Check is the user already follow or not.

        If already follow. Then,unfollow delete the object.
        Else create new follower objects.
        """
        exist = FollowData.objects.filter(this_user=self.target_user,
                                          follow_by=self.user)
        if exist.count():
            exist.delete()
            return Response({"success": "Successfully"
                                        " Unfollow the user."},
                            status=201)

        FollowData.objects.create(this_user=self.target_user,
                                  follow_by=self.user)

        return Response({"success": "Successfully add follower data."},
                        status=201)


class NotePost(PostStrategy):
    """Class for created new Note object."""

    def post_data(self, data: dict):
        """Add new note to the database."""
        try:
            course = CourseData.objects.get(
                course_id=data['course_id'],
                course_type=data['course_type']
            )

            user = UserData.objects.get(email=data['email'])

            if 'file' not in data or not data['file']:
                return Response({"error": "File is missing."}, status=400)

            anonymous = True
            if not data['pen_name']:
                data['pen_name'] = user.user_name

            if data['pen_name'] == user.user_name:
                anonymous = False

            try:
                file_data = base64.b64decode(data['file'])
            except Exception as e:
                return Response({"error": f"Invalid file data: {str(e)}"},
                                status=400)

            # ggc storage upload
            storage_client = storage.Client.from_service_account_info(GOOGLE_CREDENTIAL)
            bucket = storage_client.bucket(settings.GS_BUCKET_NAME)

            file_name = data['file_name'] + '.pdf'

            def upload_file_with_rename(g_bucket, _file_data,
                                        original_filename):
                filename, ext = os.path.splitext(original_filename)
                counter = 1
                blob_name = original_filename

                while g_bucket.blob(blob_name).exists():
                    blob_name = f"{filename}({counter}){ext}"
                    counter += 1

                blob = g_bucket.blob(blob_name)
                blob.upload_from_string(_file_data,
                                        content_type='application/pdf')
                return blob, blob_name

            blob, file_name = upload_file_with_rename(bucket, file_data,
                                                      file_name)

            note = Note.objects.create(
                course=course,
                user=user,
                faculty=data['faculty'],
                file_name=file_name,
                pdf_url=blob,
                pen_name=data['pen_name'],
                date_data=timezone.now(),
                anonymous=anonymous
            )

            HistoryPost().post_data({
                "email": data['email'],
                "id": note.note_id,
                "data_type": "note",
                "anonymous": anonymous
            })

            return Response({"success": "Note created successfully."},
                            status=201)

        except KeyError:
            return Response({"error": "Data is missing "
                                      "from the request body."}, status=400)

        except CourseData.DoesNotExist:
            return Response({"error": "This course"
                                      " isn't in the database."}, status=401)

        except UserData.DoesNotExist:
            return Response({"error": "This user isn't"
                                      " in the database."}, status=401)


class QuestionPost(PostStrategy):
    """Class for creating new QA_Question object."""

    def post_data(self, data: dict):
        """Add new QA_Question to the database."""
        try:
            user = UserData.objects.get(user_id=data['user_id'])
            course = CourseData.objects.get(course_id=data['course_id'],
                                            course_type=data['course_type'])
            qa_instance = QA_Question.objects.create(
                                    question_title=data['question_title'],
                                    question_text=data['question_text'],
                                    user=user,
                                    faculty=data['faculty'],
                                    course=course,
                                    pen_name=data['pen_name'],
                                    is_anonymous=(user.user_name != data['pen_name']),
                                    )

            HistoryPost().post_data({
                "email": user.email,
                "id": qa_instance.question_id,
                "data_type": "qa",
                "anonymous": (user.user_name != data['pen_name'])
            })

        except UserData.DoesNotExist:
            return Response({"error": "This user isn't in the database."},
                            status=400)
        
        except CourseData.DoesNotExist:
            return Response({"error": "This course isn't in the database."},
                            status=400)

        except KeyError:
            return Response({"error": "Data is missing "
                                      "from the request body."}, status=400)

        return Response({"success": "QA_Question created successfully."},
                        status=201)


class QuestionUpvotePost(PostStrategy):
    """Class for creating new QA_Question_Upvote object."""
    def __init__(self):
        self.question = None
        self.user = None

    def post_data(self, data: dict):
        try:
            self.question = QA_Question.objects.get(question_id=data['question_id'])
            self.user = UserData.objects.get(user_id=data['user_id'])

        except QA_Question.DoesNotExist:
            return Response({"error": "This question isn't in the database."},
                            status=400)

        except UserData.DoesNotExist:
            return Response({"error": "This user isn't in the database."},
                            status=400)

        except KeyError:
            return Response({"error": "Data is missing "
                                      "from the request body."}, status=400)

        return self.add_or_delete()

    def add_or_delete(self):

        if upvote := QA_Question_Upvote.objects.filter(question=self.question,
                                                       user=self.user):
            upvote.delete()
            return Response({"success": "Successfully unlike the Question."},
                            status=201)

        QA_Question_Upvote.objects.create(question=self.question,
                                            user=self.user)
        return Response({"success": "Successfully like the Question."},
                        status=201)


class AnswerPost(PostStrategy):
    """Class for creating new QA_Answer object."""

    def post_data(self, data: dict):
        """Add new QA_Answer to the database."""
        try:
            user = UserData.objects.get(user_id=data['user_id'])
            question = QA_Question.objects.get(question_id=data['question_id'])
            QA_Answer.objects.create(question=question,
                                     user=user,
                                     answer_text=data['answer_text'],
                                     pen_name=data['pen_name'],
                                     is_anonymous=(user.user_name != data['pen_name']),
                                     )

        except UserData.DoesNotExist:
            return Response({"error": "This user isn't in the database."},
                            status=400)

        except QA_Question.DoesNotExist:
            return Response({"error": "This question isn't in the database."},
                            status=400)

        except KeyError:
            return Response({"error": "Data is missing "
                                      "from the request body."}, status=400)

        return Response({"success": "QA_Answer created successfully."},
                        status=201)


class AnswerUpvotePost(PostStrategy):
    """Class for creating new QA_Answern_Upvote object."""

    def __init__(self):
        self.answer = None
        self.user = None

    def post_data(self, data: dict):
        try:
            self.answer = QA_Answer.objects.get(answer_id=data['id'])
            self.user = UserData.objects.get(email=data['email'])

        except QA_Answer.DoesNotExist:
            return Response({"error": "This question isn't in the database."},
                            status=400)

        except UserData.DoesNotExist:
            return Response({"error": "This user isn't in the database."},
                            status=400)

        except KeyError:
            return Response({"error": "Data is missing "
                                      "from the request body."}, status=400)

        return self.add_or_delete()

    def add_or_delete(self):
        if upvote := QA_Answer_Upvote.objects.filter(answer=self.answer,
                                                       user=self.user):
            upvote.delete()
            return Response({"success": "Successfully Unlike the Answer."},
                            status=201)

        QA_Answer_Upvote.objects.create(answer=self.answer,
                                            user=self.user)

        return Response({"success": "Successfully like the Answer."},
                        status=201)



class BookMarkPost(PostStrategy):
    """Class for created new Bookmark objects"""

    def __init__(self):
        """Initialize method for BookMarkPost."""
        self.table = {"review":CourseReview, "note": Note, "qa": QA_Question}

    def post_data(self, data: dict):
        """Create a new Bookmark object in the database."""
        try:
            if data['data_type'] not in self.table or not self.table[data['data_type']]:
                return Response({"error": "Invalid data_type provided."}, status=400)

            content_type = ContentType.objects.get_for_model(self.table[data['data_type']])
            user = UserData.objects.get(email=data['email'])

            return self.add_or_delete(content_type, user, data)

        except KeyError:
            return Response({"error": "Required data is"
                                      " missing from the request body."},
                            status=400)

        except UserData.DoesNotExist:
            return Response({"error": "The specified"
                                      " user does not exist."},
                            status=404)

        except ContentType.DoesNotExist:
            return Response({"error": "Content type not"
                                      " found for the specified model."},
                            status=404)

        except CourseReview.DoesNotExist:
            return Response({"error": "The specified"
                                      " review does not exist."},
                            status=404)

        except Note.DoesNotExist:
            return Response({"error": "The specified"
                                      " note does not exist."},
                            status=404)

    @staticmethod
    def add_or_delete(content_type, user: UserData, data: dict):
        """
        Check is the user already bookmark or not.

        If already bookmark. Then, delete the object.
        Else create new BookMark objects.
        """
        exist = BookMark.objects.filter(content_type=content_type,
                                        object_id=data['id'],
                                        user=user,
                                        data_type=data['data_type']
                                        )
        if exist.count():
            exist.delete()
            return Response({"success": "Successfully"
                                        " remove the bookmark."},
                            status=201)

        BookMark.objects.create(
            content_type=content_type,
            user=user,
            object_id=data['id'],
            data_type=data['data_type']
        )

        return Response({"success": "Bookmark created"
                                    " successfully."},
                        status=201)


class HistoryPost(PostStrategy):
    """Class for save the objects to the history."""

    def __init__(self):
        """Initialize method for HistoryPost."""
        self.table = {"review":CourseReview, "note": Note, "qa": QA_Question}

    def post_data(self, data: dict):
        """Create a new History object in the database."""
        try:
            if data['data_type'] not in self.table or not self.table[data['data_type']]:
                return Response({"error": "Invalid data_type provided."}, status=400)

            content_type = ContentType.objects.get_for_model(self.table[data['data_type']])
            user = UserData.objects.get(email=data['email'])

            History.objects.create(
                content_type=content_type,
                user=user,
                object_id=data['id'],
                data_type=data['data_type'],
                anonymous=data['anonymous']
            )

        except KeyError:
            return Response({"error": "History required data is"
                                      " missing from the request body."},
                            status=400)

        except UserData.DoesNotExist:
            return Response({"error": "The specified"
                                      " user does not exist. (History)"},
                            status=404)

        except ContentType.DoesNotExist:
            return Response({"error": "Content type not"
                                      " found for the specified model. (History)"},
                            status=404)

        except CourseReview.DoesNotExist:
            return Response({"error": "The specified"
                                      " review does not exist. (History)"},
                            status=404)

        except Note.DoesNotExist:
            return Response({"error": "The specified"
                                      " note does not exist. (History)"},
                            status=404)


class PostFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPost,
        "user": UserDataPost,
        "profile": UserProfilePost,
        "review_upvote": ReviewUpvotePost,
        "question_upvote": QuestionUpvotePost,
        "answer_upvote": AnswerUpvotePost,
        "follow": FollowPost,
        "note": NotePost,
        "question": QuestionPost,
        "answer": AnswerPost,
        "book": BookMarkPost,
    }

    @classmethod
    def get_post_strategy(cls, query: str) -> PostStrategy:
        """
        Update the data based on the name of table.

        Args:
            query (str): The query parameter to choose the strategy.

        Returns:
            PostStrategy: The corresponding post strategy class.

        Raises:
            ValueError: If the query stringdoesn't match any available
            strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        else:
            raise ValueError(f"Invalid post parameter: {query}")
