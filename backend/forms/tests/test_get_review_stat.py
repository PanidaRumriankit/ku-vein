from ..db_query import ReviewFilter
from django.test import TestCase
from .set_up import course_set_up, review_set_up, user_set_up, upvote_set_up


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.filter = ReviewFilter()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()
        self.get_review = self.filter.get_data("1")

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.get_review, list)

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'courses_id', 'courses_name', 'avg_effort', 'avg_rating',
            'mode_grade', 'mode_class_type', 'mode_attendance',
            'mode_criteria', 'mode_rating', 'mode_faculty'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_mode_data(self):
        """Should return correct Mode data."""
        self.assertEqual("work-base", self.get_review[0]['mode_criteria'])
        self.assertEqual("B", self.get_review[0]['mode_grade'])
        self.assertEqual("online", self.get_review[0]['mode_class_type'])

    def test_avg_data(self):
        """Should return correct Avg data."""
        self.assertAlmostEqual(self.get_review[0]['avg_effort'], (2 + 3 + 4) / 3)
        self.assertAlmostEqual(self.get_review[0]['avg_rating'], (4.6 + 4.7 + 4.5) / 3)