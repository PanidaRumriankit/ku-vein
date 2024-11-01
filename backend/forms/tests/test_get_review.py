"""Module for test everything that relate to get data in the Review feature."""

from ..db_query import SortReview
from django.test import TestCase
from .set_up import course_set_up, review_set_up, user_set_up, upvote_set_up


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.earliest = SortReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.earliest.get_data("earliest"), list)

    def test_order_by_earliest(self):
        """Data should order by first to last."""
        expected_values = [item['course_id'] for item in self.data]
        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.earliest.get_data("earliest")])


class LatestReviewTests(TestCase):
    """Test cases for LatestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.latest = SortReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.latest.get_data("latest"), list)

    def test_order_by_latest(self):
        """Data should order by last to first."""
        expected_values = [item['course_id'] for item in self.data]
        expected_values.reverse()

        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.latest.get_data("latest")])


class UpvoteReviewTests(TestCase):
    """Test cases for UpvoteReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote = SortReview()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.upvote.get_data("upvote"), list)

    def test_order_by_upvote(self):
        """Data should order by highest to lowest."""
        upvote_set_up(self.review, self.user)
        self.assertEqual([5, 4, 3, 2, 1],
                         [item['upvote']
                          for item in self.upvote.get_data("upvote")])
