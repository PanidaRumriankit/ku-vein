import json

from django.test import TestCase

from .set_up import (user_set_up, course_set_up)
from ..db_post import ReviewPost, HistoryPost
from ..models.bookmark_history_model import History
from ..models.review_model import CourseReview


class HistoryPostTests(TestCase):
    """Test cases for BookMark create object."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.history = History
        self.history_post = HistoryPost()
        self.review_post = ReviewPost()
        self.course = course_set_up()[0]
        self.user = user_set_up()

    def test_response_post_data_missing_data(self):
        """Test creating a History with missing data."""
        response = self.history_post.post_data({"email": self.user[0].email})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.content), {"error": "History required data is"
                                      " missing from the request body."}
        )

    def test_response_post_data_user_not_in_database(self):
        """Test creating a history with email not in database."""
        response = self.history_post.post_data(
            {
                "email": "test@gmail.com",
                "id": 1,
                "data_type": "review"
            }
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            json.loads(response.content), {"error": "The specified"
                                      " user does not exist. (History)"}
        )

    def test_successfully_post_review(self):
        """Test value for creating a history with correct review data."""
        review_data =  {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings on"
                       " miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 2024,
            "pen_name": "Solaire of Astora",
            "grade": "A",
            "effort": 2,
            "attendance": 4,
            "scoring_criteria": "work-base",
            "class_type": "onsite",
            "anonymous": False,
            "instructor": "Hu Tao",
        }

        self.review_post.post_data(review_data)
        review = CourseReview.objects.get(user__email=review_data['email'])
        result_data = self.history.objects.values(
            'object_id',
            'data_type',
            'user'
        ).first()

        self.assertEqual(self.user[0].user_id, result_data['user'])
        self.assertEqual(review.review_id, result_data['object_id'])
        self.assertIsInstance(self.history.objects.first().instance, CourseReview)
        self.assertEqual('review', result_data['data_type'])
