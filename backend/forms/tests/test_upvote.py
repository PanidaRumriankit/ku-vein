from ..db_query import SortReview
from ..db_post import UpvotePost
from django.test import TestCase
from .set_up import user_set_up
from .test_get_review import review_set_up
from .test_course_data import course_set_up


class UpvotePostTests(TestCase):
    """Test cases for Upvote."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote = UpvotePost()
        self.sort = SortReview()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()

    def test_post_upvote(self):

        self.upvote.post_data(TEST_DATA[0])
        self.assertEqual(1, self.sort.get_data("earliest")['upvote'])
