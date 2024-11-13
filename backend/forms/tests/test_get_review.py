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
        self.get_review = self.earliest.get_data("earliest")

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.get_review, list)

    def test_order_by_earliest(self):
        """Data should order by first to last."""
        expected_values = [item['course_id'] for item in self.data]
        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.earliest.get_data("earliest")])

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties', 'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades', 'professor',
            'criteria', 'type', 'upvote'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_contain_data_with_course_id(self):
        """Test to check is GET method with course_id return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties', 'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades', 'professor',
            'criteria', 'type', 'upvote', 'avg_effort', 'avg_attend', 'avg_rating', 'mode_grade',
            'mode_criteria', 'mode_type'
        ]

        for key in expected_keys:
            self.assertIn(key, self.earliest.get_data("earliest", "1")[0])

    def test_mode_data(self):
        """Should return correct Mode data."""
        mode_data = self.earliest.get_data("earliest", "1")[0]
        self.assertEqual("work-base", mode_data['mode_criteria'])
        self.assertEqual("B", mode_data['mode_grade'])
        self.assertEqual("online", mode_data['mode_type'])

    def test_avg_data(self):
        """Should return correct Avg data."""
        mode_data = self.earliest.get_data("earliest", "1")[0]
        self.assertAlmostEqual(mode_data['avg_effort'], (2 + 3 + 4)/3)
        self.assertAlmostEqual(mode_data['avg_attend'], (4 + 5 + 4)/3 )
        self.assertAlmostEqual(mode_data['avg_rating'], (4.6 + 4.7 + 4.5)/3)


class LatestReviewTests(TestCase):
    """Test cases for LatestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.latest = SortReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()
        self.get_review = self.latest.get_data("latest")


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

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties', 'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades', 'professor',
            'criteria', 'type', 'upvote'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_contain_data_with_course_id(self):
        """Test to check is GET method with course_id return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties', 'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades', 'professor',
            'criteria', 'type', 'upvote', 'avg_effort', 'avg_attend', 'avg_rating', 'mode_grade',
            'mode_criteria', 'mode_type'
        ]

        for key in expected_keys:
            self.assertIn(key, self.latest.get_data("latest", "1")[0])

    def test_mode_data(self):
        """Should return correct Mode data."""
        mode_data = self.latest.get_data("latest", "1")[0]
        self.assertEqual("work-base", mode_data['mode_criteria'])
        self.assertEqual("B", mode_data['mode_grade'])
        self.assertEqual("online", mode_data['mode_type'])

    def test_avg_data(self):
        """Should return correct Avg data."""
        mode_data = self.latest.get_data("latest", "1")[0]
        self.assertAlmostEqual(mode_data['avg_effort'], (2 + 3 + 4)/3)
        self.assertAlmostEqual(mode_data['avg_attend'], (4 + 5 + 4)/3 )
        self.assertAlmostEqual(mode_data['avg_rating'], (4.6 + 4.7 + 4.5)/3)


class UpvoteReviewTests(TestCase):
    """Test cases for UpvoteReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote = SortReview()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()
        self.get_review = self.upvote.get_data("upvote")

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.upvote.get_data("upvote"), list)

    def test_order_by_upvote(self):
        """Data should order by highest to lowest."""
        upvote_set_up(self.review, self.user)
        self.assertEqual([5, 4, 3, 2, 1, 0, 0],
                         [item['upvote']
                          for item in self.upvote.get_data("upvote")])

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties', 'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades', 'professor',
            'criteria', 'type', 'upvote'
        ]

        for key in expected_keys:
            self.assertIn(key, self.get_review[0])

    def test_contain_data_with_course_id(self):
        """Test to check is GET method with course_id return all demand field."""
        expected_keys = [
            'reviews_id', 'courses_id', 'courses_name', 'faculties', 'username',
            'review_text', 'ratings', 'year', 'name', 'date', 'grades', 'professor',
            'criteria', 'type', 'upvote', 'avg_effort', 'avg_attend', 'avg_rating', 'mode_grade',
            'mode_criteria', 'mode_type'
        ]

        for key in expected_keys:
            self.assertIn(key, self.upvote.get_data("upvote", "1")[0])

    def test_mode_data(self):
        """Should return correct Mode data."""
        mode_data = self.upvote.get_data("upvote", "1")[0]
        self.assertEqual("work-base", mode_data['mode_criteria'])
        self.assertEqual("B", mode_data['mode_grade'])
        self.assertEqual("online", mode_data['mode_type'])

    def test_avg_data(self):
        """Should return correct Avg data."""
        mode_data = self.upvote.get_data("upvote", "1")[0]
        self.assertAlmostEqual(mode_data['avg_effort'], (2 + 3 + 4)/3)
        self.assertAlmostEqual(mode_data['avg_attend'], (4 + 5 + 4)/3 )
        self.assertAlmostEqual(mode_data['avg_rating'], (4.6 + 4.7 + 4.5)/3)
