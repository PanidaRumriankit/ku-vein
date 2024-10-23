import os
import sys
import django

from django.db.models import F
from backend.forms.models import Inter, ReviewStat
from abc import ABC, abstractmethod

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()


class QueryStrategy(ABC):
    """Abstract base class for make the query."""

    @abstractmethod
    def get_data(self):
        """Get the data from the database."""
        pass

class EarliestReview(QueryStrategy):
    """Table for sent CourseReview sorted by earliest."""

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
            date_data=F('date_data'),
            grade=F('grade'),
            upvotes=F('upvotes'),
        ).order_by('date_data')

        return list(review_data)

class LatestReview(QueryStrategy):
    """Table for sent CourseReview sorted by latest."""

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
            date_data=F('date_data'),
            grade=F('grade'),
            upvotes=F('upvotes'),
        ).order_by('-date_data')

        return list(review_data)

class UpvoteReview(QueryStrategy):
    """Table for sent CourseReview sorted by upvote."""

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
            date_data=F('date_data'),
            grade=F('grade'),
            upvotes=F('upvotes'),
        ).order_by('-upvotes')

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


if __name__ == "__main__":
    d = DatabaseQuery()
    print(d.send_all_course_data())

