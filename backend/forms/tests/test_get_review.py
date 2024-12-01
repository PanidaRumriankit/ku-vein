"""Module for test everything that relate to get data in the Review feature."""

from django.test import TestCase

from .set_up import course_set_up, review_set_up, user_set_up, upvote_set_up
from ..db_query import SortReview

EARLIEST = {"sort": "earliest"}
LATEST = {"sort": "latest"}
UPVOTE = {"sort": "upvote"}


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.earliest = SortReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()
        self.get_review = self.earliest.get_data(EARLIEST)

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.get_review, list)

    def test_order_by_earliest(self):
        """Data should order by first to last."""
        expected_values = [item['course_id'] for item in self.data]
        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.earliest.get_data(EARLIEST)])

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties',
            'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades',
            'professor', 'attendances', 'efforts',
            'criteria', 'classes_type', 'courses_type', 'upvote'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_filter_working(self):
        """Filter_by key should filter the data."""
        filter = {"sort": "earliest", "course_id": "1"}
        self.assertEqual(3, len(self.earliest.get_data(filter)))


class LatestReviewTests(TestCase):
    """Test cases for LatestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.latest = SortReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()
        self.get_review = self.latest.get_data(LATEST)

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.latest.get_data(LATEST), list)

    def test_order_by_latest(self):
        """Data should order by last to first."""
        expected_values = [item['course_id'] for item in self.data]
        expected_values.reverse()

        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.latest.get_data(LATEST)])

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties',
            'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades',
            'professor', 'attendances', 'efforts',
            'criteria', 'classes_type', 'courses_type', 'upvote'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_filter_working(self):
        """Filter_by key should filter the data."""
        filter = {"sort": "latest", "course_id": "1"}
        self.assertEqual(3, len(self.latest.get_data(filter)))


class UpvoteReviewTests(TestCase):
    """Test cases for UpvoteReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote = SortReview()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()
        self.get_review = self.upvote.get_data(UPVOTE)

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.upvote.get_data(UPVOTE), list)

    def test_order_by_upvote(self):
        """Data should order by highest to lowest."""
        upvote_set_up(self.review, self.user)
        self.assertEqual([5, 4, 3, 2, 1, 0, 0, 0, 0],
                         [item['upvote']
                          for item in self.upvote.get_data(UPVOTE)])

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties',
            'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades',
            'professor', 'attendances', 'efforts',
            'criteria', 'classes_type', 'courses_type', 'upvote'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_filter_working(self):
        """Filter_by key should filter the data."""
        filter = {"sort": "upvote", "course_id": "1"}
        self.assertEqual(3, len(self.upvote.get_data(filter)))
