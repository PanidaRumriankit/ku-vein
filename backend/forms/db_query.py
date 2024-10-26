import os
import sys
import django

# Add the parent directory to the Python path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()

from typing import Union
from django.db.models import F
from abc import ABC, abstractmethod
from backend.forms.models import Inter, ReviewStat, CourseReview


class QueryStrategy(ABC):
    """Abstract base class for make the query."""

    @abstractmethod
    def get_data(self):
        """Get the data from the database."""
        pass


class QueryFilterStrategy(ABC):
    """Abstract base class for make the query with condition."""

    @abstractmethod
    def get_data(self, filter_key: dict):
        """Get the data from the database."""
        pass


class EarliestReview(QueryStrategy):
    """Class for sent CourseReview sorted by earliest."""

    def get_data(self):
        """
        Get the sorted data from the database.

        Order by, earliest data.
        """
        review_data = ReviewStat.objects.values(
            courses_id=F('review__course__course_id'),
            courses_name=F('review__course__course_name'),
            faculty=F('review__course__faculty'),
            user_name=F('review__user__user_name'),
            reviews=F('review__reviews'),
            ratings=F('rating'),
            year=F('academic_year'),
            name=F('pen_name'),
            date=F('date_data'),
            grades=F('grade'),
            upvote=F('up_votes')
        ).order_by('review__review_id')

        return list(review_data)


class LatestReview(QueryStrategy):
    """Class for sent CourseReview sorted by latest."""

    def get_data(self):
        """
        Get the sorted data from the database.

        Order by, latest data.
        """
        review_data = ReviewStat.objects.values(
            courses_id=F('review__course__course_id'),
            courses_name=F('review__course__course_name'),
            faculty=F('review__course__faculty'),
            user_name=F('review__user__user_name'),
            reviews=F('review__reviews'),
            ratings=F('rating'),
            year=F('academic_year'),
            name=F('pen_name'),
            date=F('date_data'),
            grades=F('grade'),
            upvote=F('up_votes')
        ).order_by('-review__review_id')

        return list(review_data)


class UpvoteReview(QueryStrategy):
    """Class for sent CourseReview sorted by upvote."""

    def get_data(self):
        """
        Get the sorted data from the database.

        Order by, upvote data.
        """
        review_data = ReviewStat.objects.values(
            courses_id=F('review__course__course_id'),
            courses_name=F('review__course__course_name'),
            faculty=F('review__course__faculty'),
            user_name=F('review__user__user_name'),
            reviews=F('review__reviews'),
            ratings=F('rating'),
            year=F('academic_year'),
            name=F('pen_name'),
            date=F('date_data'),
            grades=F('grade'),
            upvote=F('up_votes')
        ).order_by('up_votes')

        return list(review_data)


class ReviewQuery(QueryFilterStrategy):
    """Class for sent specific review."""

    def get_data(self, filter_key: dict):
        """Get the review data from the database."""
        review = CourseReview.objects.filter(review_id=filter_key['review_id'])
        stat = ReviewStat.objects.filter(review=review)

        review_data = stat.objects.values(
            courses_id=F('review__course__course_id'),
            courses_name=F('review__course__course_name'),
            faculty=F('review__course__faculty'),
            user_name=F('review__user__user_name'),
            reviews=F('review__reviews'),
            ratings=F('rating'),
            year=F('academic_year'),
            name=F('pen_name'),
            date=F('date_data'),
            grades=F('grade'),
            upvote=F('up_votes')
        )

        return list(review_data)


class DatabaseQuery:
    """Main class for handle the request from frontend"""

    def __init__(self):
        self.data = None

    @staticmethod
    def send_all_course_data():
        """Send the course_id, course_name, and faculty to frontend."""
        course_data = Inter.objects.select_related('course').values(
            courses_id=F('course__course_id'),
            courses_name=F('course__course_name'),
            faculty=F('course__faculty')
        )

        return list(course_data)


class QueryFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "earliest": EarliestReview,
        "latest": LatestReview,
        "upvote": UpvoteReview,
        "review": ReviewQuery
    }

    @classmethod
    def get_query_strategy(cls, query: str) -> Union[
        QueryStrategy, QueryFilterStrategy]:
        """
        Return the query strategy based on the query string.

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
            raise ValueError(f"Invalid query parameter: {query}")


if __name__ == "__main__":
    d = DatabaseQuery()
    print(d.send_all_course_data())
