# pylint: skip-file
# -1: [file-ignored]

from ..models import CourseData
from ..db_query import EarliestReview
from ..db_post import UserDataPost, ReviewPost
from ..db_management import DatabaseManagement
from django.test import TestCase


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
