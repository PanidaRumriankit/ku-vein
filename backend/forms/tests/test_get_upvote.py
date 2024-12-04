import json

from django.test import TestCase

from .set_up import (user_set_up, review_set_up,
                     course_set_up)
from ..db_query import UpvoteQuery
from ..models.review_model import UpvoteStat

TEST_DATA = [

        {"email": "solaire@gmail.com", "course_id": "1",
         "course_type": "Priest", "faculty": "Miracle"},

        {"email": "logan@gmail.com", "course_id": "2",
         "course_type": "Sorcerer", "faculty": "Sorcery"},

        {"email": "laurentius@gmail.com", "course_id": "3",
         "course_type": "Pyromancer", "faculty": "Pyromancy"},

        {"email": "aslatiel@gmail.com", "course_id": "4",
         "course_type": "Hexer", "faculty": "Hexes"},

        {"email": "siegmeyer@gmail.com", "course_id": "5",
         "course_type": "Knight", "faculty": "Faith"}
    ]

class UpvoteQueryTests(TestCase):
    """Test cases for Upvote."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote_query = UpvoteQuery()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()

    def test_get_data_key_error(self):
        """Test for missing required keys (KeyError)."""
        filter_key = {"email": self.user[0].email}
        response = self.upvote_query.get_data(filter_key)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'error': "Missing review_id or email"
                                   " from response body"})

    def test_get_data_review_does_not_exist(self):
        """Test for non-existent CourseReview (DoesNotExist)."""
        filter_key = {"email": self.user[0].email, "review_id": 999}
        response = self.upvote_query.get_data(filter_key)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {'error': "This review isn't in the database."})

    def test_get_data_user_does_not_exist(self):
        """Test for non-existent UserData (DoesNotExist)."""
        filter_key = {"email": "nonexistent_user@example.com", "review_id": self.review[0].review.review_id}
        response = self.upvote_query.get_data(filter_key)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {'error': "This user isn't in the database."})

    def test_exist_upvote(self):
        """User already like this review."""
        UpvoteStat.objects.create(
            review_stat=self.review[0],
            user=self.user[0]
        )

        filter_key = {
            "email": self.user[0].email,
            "review_id": self.review[0].review.review_id
        }

        self.assertTrue(self.upvote_query.get_data(filter_key))

    def test_doesnt_exist_upvote(self):
        """User isn't like this review."""
        filter_key = {
            "email": self.user[0].email,
            "review_id": self.review[0].review.review_id
        }

        self.assertFalse(self.upvote_query.get_data(filter_key))

    def test_user_like_other_review(self):
        """User like other review but doesn't like this review."""
        UpvoteStat.objects.create(
            review_stat=self.review[0],
            user=self.user[0]
        )

        filter_key = {
            "email": self.user[0].email,
            "review_id": self.review[1].review.review_id
        }

        self.assertFalse(self.upvote_query.get_data(filter_key))