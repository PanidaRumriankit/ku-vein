import os
import sys
import django
import logging

from datetime import datetime
from abc import ABC, abstractmethod
from ninja.responses import Response
from backend.forms.models import CourseReview, UserData, CourseData, ReviewStat


# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()

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
            if not UserData.objects.filter(email=data['email']):
                UserData.objects.create(user_name=f"user_{UserData.objects.count()}", user_type="student", email=data['email'])
                logger.debug(f"created user: user_{UserData.objects.count()} {data['email']}")
                return Response({"success": "The User is successfully created."}, status=201)

        except KeyError:
            return Response({"error": "email is missing from the response body."}, status=400)


class ReviewPost(PostStrategy):
    """Class for created new CourseReview object."""

    def post_data(self, data: dict):
        """Add the data to the CourseReview."""
        try:
            cur_user = UserData.objects.filter(email=data['email']).first()
            cur_course = CourseData.objects.filter(course_id=data['course_id'],
                                                   faculty=data['faculty'], course_type=data['course_type']).first()
        except KeyError:
            return Response({"error": "User data or Course Data are missing from the response body."}, status=400)

        if not cur_user or not cur_course:
            return Response({"error": "This user or This course isn't in the database."}, status=401)

        try:
            if not data['pen_name']:
                data['pen_name'] = cur_user.user_name

            if not data['academic_year']:
                data['academic_year'] = datetime.now().year

        except KeyError:
            return Response({"error": "pen_name or academic_year are missing"}, status=400)

        review_instance = CourseReview.objects.create(user=cur_user, course=cur_course, reviews=data['reviews'])
        ReviewStat.objects.create(review=review_instance, rating=data['rating'],
                                  academic_year=data['academic_year'],
                                  pen_name=data['pen_name'],
                                  date_data=datetime.now().date(), grade=data['grade'], up_votes=0)

        return Response({"success": "The Review is successfully created."}, status=201)


class PostFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPost,
        "user": UserDataPost
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
            ValueError: If the query string doesn't match any available strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        else:
            raise ValueError(f"Invalid post parameter: {query}")