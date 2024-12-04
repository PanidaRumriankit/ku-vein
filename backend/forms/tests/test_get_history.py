from django.test import TestCase

from .set_up import course_set_up, review_set_up, user_set_up
from ..db_query import HistoryQuery
from ..models.bookmark_history_model import History


class HistoryQueryTests(TestCase):
    """Test cases for  HistoryQuery."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.history = History
        self.history_query = HistoryQuery()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()
        self.this_user = self.history_query.get_data(
            target_user=self.user[0].user_id,
            is_other_user=False
        )
        self.other_user = self.history_query.get_data(
            target_user=self.user[0].user_id,
            is_other_user=True
        )

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.this_user, list)
        self.assertIsInstance(self.other_user, list)

    def test_correct_other_user_output(self):
        """
        Length should be 1.
        Because Solaire have only 1 not anonymous.
        """
        self.assertEqual(1, len(self.other_user))

    def test_correct_this_user_output(self):
        """
        Length should be 3.
        Because it should return everything if current user watch it.
        """
        self.assertEqual(3, len(self.this_user))
