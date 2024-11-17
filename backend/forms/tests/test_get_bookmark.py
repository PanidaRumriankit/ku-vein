from ..db_query import BookMarkQuery
from django.test import TestCase
from .set_up import course_set_up, review_set_up, user_set_up, book_setup


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.book_query = BookMarkQuery()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()
        self.book = book_setup(self.review, self.user)
        self.get_book = self.book_query.get_data(email=self.user[0].email)

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.get_book, list)

    def test_contain_data(self):
        """Test to check is GET method return all demand field."""
        expected_keys = [
            'object_id', 'data_type'
        ]
        for key in expected_keys:
            self.assertIn(key, self.get_book[0])

    def test_correct_data_type_value(self):
        """Test to check is it return the correct value."""
        for check in self.get_book:
            self.assertIn(check['data_type'], ['review', 'note', 'qa'])

    def test_correct_object_id_value(self):
        """Test to check is it return the correct value."""
        for i, check in enumerate(self.get_book):
            if check['data_type'] == 'review':
                self.assertEqual(check['object_id'], self.review[i].review.review_id)
