# pylint: skip-file
# -1: [file-ignored]

from ..models import CourseData, UserData
from ..db_query import EarliestReview
from ..db_post import UserDataPost, ReviewPost
from ninja.responses import Response
from ..db_management import DatabaseManagement
from django.test import TestCase

class ReviewPostTests(TestCase):
    """Test cases for ReviewPost."""

    def setUp(self):
        """Set up reusable instances for tests."""

        self.review_post = ReviewPost()
        self.user = []
        user_test_data =[
            {"user_name": "Solaire of Astora", "user_type": "Knight", "email": "solaire@gmail.com"},
            {"user_name": "Siegmeyer of Catarina", "user_type": "Knight", "email": "siegmeyer@gmail.com"},
            {"user_name": "Lucatiel of Mirrah ", "user_type": "Knight", "email": "aslatiel@gmail.com"},
            {"user_name": "Big Hat Logan", "user_type": "Sorcerer", "email": "logan@gmail.com"},
            {"user_name": "Laurentius of the Great Swamp", "user_type": "Pyromancer", "email": "laurentius@gmail.com"}
        ]

        for add_user in user_test_data:
            self.user.append(UserData.objects.create(**add_user))

    def test_error_response_from_missing_user_data(self):
        """Test missing user data."""

        test_data = {
            "course_id": "string",
            "course_type": "string",
            "faculty": "string",
            "reviews": "string",
            "rating": 0,
            "academic_year": 0,
            "pen_name": "string",
            "grade": "string"
        }
        response = self.review_post.post_data(test_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "User data or Course Data are missing"})

class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.earliest_review = EarliestReview()

        data = {}
        # CourseData.objects.create(**data)


    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertEqual(self.earliest_review.get_data(), [])

    def test_order_by_earliest(self):
        pass
