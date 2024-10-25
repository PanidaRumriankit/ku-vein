import os
import sys
import django

from datetime import datetime
from abc import ABC, abstractmethod


# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()

from ninja.responses import Response
from backend.forms.models import CourseReview, UserData, CourseData, ReviewStat

class PostStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def post_data(self, data):
        """Update the data to the database."""
        pass

class ReviewPost(PostStrategy):
    """Class for created new CourseReview object."""

    def post_data(self, data: dict):
        """Add the data to the CourseReview."""
        cur_user = UserData.objects.filter(user_id=data['user_id']).first()
        cur_course = CourseData.objects.filter(course_id=data['course_id'], faculty=data['faculty']).first()

        if not cur_user or not cur_course:
            return Response({"error": "Authorization header missing"}, status=401)

        if not data['pen_name']:
            data['pen_name'] = cur_user.user_name

        if not data['academic_year']:
            data['academic_year'] = datetime.now().year

        review_instance = CourseReview.objects.create(user=cur_user, course=cur_course, reviews=data['reviews'])
        ReviewStat.objects.create(review=review_instance, rating=data['rating'],
                                  academic_year=data['academic_year'],
                                  pen_name=data['pen_name'],
                                  date_data=datetime.now().date(), grade=data['grade'], up_votes=0)

        return Response({"success": "The Review is successfully created."}, status=201)

class PostFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPost
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