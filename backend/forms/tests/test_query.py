# pylint: skip-file
# -1: [file-ignored]

from ..db_query import EarliestReview
from django.test import TestCase


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def test_correct_data_format(self):
        """Data should return as a list."""
        test = EarliestReview().get_data()
        self.assertEqual(test, [])
