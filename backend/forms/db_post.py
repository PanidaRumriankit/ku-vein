"""This module use for post and update database."""

import logging

from datetime import datetime
from abc import ABC, abstractmethod
from ninja.responses import Response
from .models import (CourseReview, UserData,
                     CourseData, ReviewStat,
                     UpvoteStat, FollowData, Note)

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
            logger.debug(f"created user: user_{UserData.objects.count()} "
                            f"{data['email']}")
            return Response({"success": "The User is successfully created."},
                            status=201)

        except KeyError:
            return Response({"error": "email is missing "
                             "from the response body."},
                            status=400)


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
            if not data['pen_name']:
                data['pen_name'] = self.user.user_name

            if not data['academic_year']:
                data['academic_year'] = datetime.now().year

        except KeyError:
            return Response({"error": "pen_name or academic_year are missing"},
                            status=400)

        review_instance = CourseReview.objects.create(user=self.user,
                                                      course=self.course,
                                                      reviews=data['reviews'])
        ReviewStat.objects.create(review=review_instance,
                                  rating=data['rating'],
                                  academic_year=data['academic_year'],
                                  pen_name=data['pen_name'],
                                  date_data=datetime.now().date(),
                                  grade=data['grade'])

        return Response({"success": "The Review is successfully created."},
                        status=201)

    def get_instance(self, data: dict):
        """Get the course and user instance."""
        try:
            self.user = UserData.objects.get(email=data['email'])
            self.course = CourseData.objects.get(
                course_id=data['course_id'],
                faculty=data['faculty'],
                course_type=data['course_type'])
        except KeyError:
            return Response({"error": "User data or Course Data are missing "
                                      "from the response body."}, status=400)

        except CourseData.DoesNotExist:
            return Response({"error": "This course isn't "
                                      "in the database."}, status=401)
        except UserData.DoesNotExist:
            return Response({"error": "This user isn't "
                                      "in the database."}, status=401)


class UpvotePost(PostStrategy):
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

        unlike = self.is_exist()

        if isinstance(unlike, Response):
            return unlike

        UpvoteStat.objects.create(review_stat=self.review_stat, user=self.user)

        return Response({"success": "Successfully Like the Review."},
                        status=201)

    def is_exist(self):
        """Check is the user already like or not."""
        exist = UpvoteStat.objects.filter(review_stat=self.review_stat, user=self.user)
        if exist.count():
            exist.delete()
            return Response({"success": "Successfully Unlike the Review."},
                            status=201)

    def get_instance(self, data: dict):
        """Get the review_stat and user instance."""
        try:
            self.user = UserData.objects.get(email=data['email'])
            self.course = CourseData.objects.get(
                course_id=data['course_id'],
                faculty=data['faculty'],
                course_type=data['course_type']
            )

            review = CourseReview.objects.get(
                course=self.course
            )

            self.review_stat = ReviewStat.objects.get(
                review=review
            )

        except KeyError:
            return Response({"error": "User data or Course Data are missing "
                                      "from the response body."}, status=400)
        except CourseData.DoesNotExist:
            return Response({"error": "This course isn't "
                                      "in the database."}, status=401)
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

    def post_data(self, data: dict):
        """Add new follower to the database."""
        try:
            cur_user = UserData.objects.filter(user_id=data['current_user_id']).first()
            target_user = UserData.objects.filter(user_id=data['target_user_id']).first()
        except KeyError:
            return Response({"error": "current_user_id or target_user_id are missing "
                                      "from the response body."}, status=400)

        if not cur_user:
            return Response({"error": "This user isn't "
                                      "in the database."}, status=401)
        elif not target_user:
            return Response({"error": "Target user isn't "
                                      "in the database."}, status=401)

        FollowData.objects.create(this_user=cur_user, follow_by=target_user)


        return Response({"success": "Successfully add follower data."},
                        status=201)


class NotePost(PostStrategy):
    """Class for created new Note object."""

    def post_data(self, data: dict):
        """Add new note to the database."""
        try:
            course = CourseData.objects.get(
                course_id=data['course_id'],
                faculty=data['faculty'],
                course_type=data['course_type']
            )

            user = UserData.objects.get(email=data['email'])

            if 'file' not in data or data['file'] is None:
                return Response({"error": "File is missing."}, status=400)

            Note.objects.create(
                course=course,
                user=user,
                note_file=data['file']
            )
            return Response({"success": "Note"
                                        " uploaded successfully."},
                            status=201)

        except KeyError:
            return Response({"error": "Data is missing "
                                      "from the response body."}, status=400)

        except CourseData.DoesNotExist:
            return Response({"error":"Course"
                                     " isn't in the database."}, status=401)
        except UserData.DoesNotExist:
            return Response({"error": "This course isn't "
                                      "in the database."}, status=401)


class PostFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPost,
        "user": UserDataPost,
        "upvote": UpvotePost,
        "follow": FollowPost,
        "note": NotePost
    }

    @classmethod
    def get_post_strategy(cls, query: str) -> PostStrategy:
        """
        Update the data based on the name of table.

        Args:
            query (str): The query parameter to choose the strategy.

        Returns:
            QueryStrategy: The corresponding query strategy class.

        Raises:
            ValueError: If the query stringdoesn't match any available
            strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        else:
            raise ValueError(f"Invalid post parameter: {query}")
