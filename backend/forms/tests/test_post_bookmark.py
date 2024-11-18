import json

from ..db_post import BookMarkPost
from ..models import BookMark
from django.test import TestCase
from .set_up import (user_set_up, review_set_up,
                     course_set_up, note_setup)

class BookMarkPostTests(TestCase):
    """Test cases for BookMark create object."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.bookmark = BookMark
        self.bookmark_post = BookMarkPost()
        self.course = course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()
        self.note = note_setup(self.course[0], self.user)

    def test_response_post_data_missing_data(self):
        """Test creating a bookmark with missing data."""
        response = self.bookmark_post.post_data({"email": self.user[0].email})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.content), {"error": "Required data is missing from the request body."}
        )

    def test_response_post_data_user_not_in_database(self):
        """Test creating a bookmark with email not in database."""
        response = self.bookmark_post.post_data(
            {
                "email": "test@gmail.com",
                "id": 1,
                "data_type": "review"
            }
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            json.loads(response.content), {"error": "The specified user does not exist."}
        )

    def test_response_successfully_post_review(self):
        """Test response for creating a bookmark with correct data."""
        response = self.bookmark_post.post_data(
            {
                "email": self.user[0].email,
                "id": self.review[0].review_id,
                "data_type": "review"
            }
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            json.loads(response.content), {"success": "Bookmark created successfully."}
        )

    def test_successfully_post_review(self):
        """Test value for creating a bookmark with correct data."""
        self.bookmark_post.post_data(
                        {
                        "email": self.user[0].email,
                        "id": self.review[0].review_id,
                        "data_type": "review"
                        }
        )

        result_data = BookMark.objects.values(
            'object_id',
            'data_type',
            'user'
        ).first()

        self.assertEqual(self.user[0].user_id, result_data['user'])
        self.assertEqual(self.review[0].review_id, result_data['object_id'])
        self.assertEqual(self.review[0].review, BookMark.objects.first().instance)
        self.assertEqual('review', result_data['data_type'])

    def test_remove_bookmark(self):
        """If post same data it should got remove."""
        test_data =  {
                "email": self.user[0].email,
                "id": self.review[1].review_id,
                "data_type": "review"
            }

        expected_data = {
            'object_id': self.review[1].review_id,
            'data_type': 'review',
            'user__email': self.user[0].email
        }

        self.bookmark_post.post_data(
            test_data
        )

        self.assertEqual(
        self.bookmark.objects.values(
            'object_id',
            'data_type',
            'user__email'
        ).first(),
        expected_data
        )

        self.bookmark_post.post_data(
            test_data
        )

        self.assertEqual([],
                         list(self.bookmark.objects.all()))

        self.bookmark_post.post_data(
            test_data
        )

        self.bookmark_post.post_data(
            {
                "email": self.user[0].email,
                "id": self.review[0].review_id,
                "data_type": "review"
            }
        )

        self.bookmark_post.post_data(
            {
                "email": self.user[0].email,
                "id": self.review[0].review_id,
                "data_type": "review"
            }
        )

        self.assertEqual(
            self.bookmark.objects.values(
                'object_id',
                'data_type',
                'user__email'
            ).first(),
            expected_data
        )

    def test_remove_different_type(self):
        self.bookmark_post.post_data(
            {
                "email": self.user[0].email,
                "id": self.review[1].review_id,
                "data_type": "review"
            }
        )

        self.bookmark_post.post_data(
            {
                "email": self.user[0].email,
                "id": self.note.note_id,
                "data_type": "note"
            }
        )

        self.bookmark_post.post_data(
            {
                "email": self.user[0].email,
                "id": self.note.note_id,
                "data_type": "note"
            }
        )

        result_data = self.bookmark.objects.values(
            'object_id',
            'data_type',
            'user__email'
        ).first()

        expected_data = {
            'object_id': self.review[1].review_id,
            'data_type': 'review',
            'user__email': self.user[0].email
        }

        self.assertEqual(result_data, expected_data)