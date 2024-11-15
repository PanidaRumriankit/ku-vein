import json

from ..db_post import BookMarkPost
from ..models import BookMark
from django.test import TestCase
from .set_up import (user_set_up, review_set_up,
                     course_set_up)

class BookMarkPostTests(TestCase):
    """Test cases for BookMark create object."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.bookmark_post = BookMarkPost()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()