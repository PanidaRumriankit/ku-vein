import json

from django.test import TestCase

from .set_up import user_set_up, review_set_up, course_set_up
from ..db_post import UpvotePost, ReviewUpvotePost
from ..db_query import SortReview

TEST_DATA = [

    {"email": "solaire@gmail.com", "course_id": "1",
     "course_type": "Priest", "faculty": "Miracle"},

    {"email": "logan@gmail.com", "course_id": "2",
     "course_type": "Sorcerer", "faculty": "Sorcery"},

    {"email": "laurentius@gmail.com", "course_id": "3",
     "course_type": "Pyromancer", "faculty": "Pyromancy"},

    {"email": "aslatiel@gmail.com", "course_id": "4",
     "course_type": "Hexer", "faculty": "Hexes"},

    {"email": "siegmeyer@gmail.com", "course_id": "5",
     "course_type": "Knight", "faculty": "Faith"}
]

EARLIEST = {"sort": "earliest"}


class UpvotePostTests(TestCase):
    """Test cases for Upvote."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote = ReviewUpvotePost()
        self.sort = SortReview()
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()

    def test_post_missing_course_data_response(self):
        """Missing ReviewData should return error response."""
        response = self.upvote.post_data({"email": "solaire@gmail.com"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "User data or Review Data are missing "
                                   "from the response body."})

    def test_post_missing_user_data_response(self):
        """Missing UserData should return error response."""
        response = self.upvote.post_data({
            "id": self.review[0].review_id
        })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "User data or Review Data are missing "
                                   "from the response body."})

    def test_post_review_not_in_db_response(self):
        """Course that not in the database shouldn't be able to have a like."""
        response = self.upvote.post_data({
            "email": "solaire@gmail.com", "id": "69"
        })

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This review isn't "
                                   "in the database."})

    def test_post_user_not_in_db_response(self):
        """User that not in the database shouldn't be able to like the review."""
        response = self.upvote.post_data({
            "email": "antonia@gmail.com", "id": self.review[0].review_id
        })

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This user isn't "
                                   "in the database."})

    def test_post_success_like_response(self):
        """Successfully like should return 201."""
        response = self.upvote.post_data({
            "email": "solaire@gmail.com", "id": self.review[0].review_id
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {'success': 'Successfully Like the Review.'})

    def test_post_success_unlike_response(self):
        """Successfully unlike should return 201."""
        
        test_data = {"email": "solaire@gmail.com",
                     "review_id": self.review[0].review_id}

        self.upvote.post_data(test_data)
        response = self.upvote.post_data(test_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {'success': 'Successfully Unlike the Review.'})

    def test_post_upvote(self):
        """Successfully like should be increase number of upvote."""
        test_data = [
            {"email": "solaire@gmail.com",
             "review_id": self.review[0].review_id},

            {"email": "logan@gmail.com",
             "review_id": self.review[0].review_id},

            {"email": "laurentius@gmail.com",
             "review_id": self.review[0].review_id},
        ]

        self.assertEqual(0, self.sort.get_data(EARLIEST)[0]['upvote'])

        for i in range(len(test_data)):
            self.upvote.post_data(test_data[i])

            sorted_data = self.sort.get_data(EARLIEST)

            self.assertEqual(i + 1, sorted_data[0]['upvote'])

    def test_unlike_review(self):
        """Remove the like if same user POST again."""
        
        test_data = {"email": "solaire@gmail.com",
                     "review_id": self.review[0].review_id}

        for i in range(2):
            self.upvote.post_data(test_data)
            sorted_data = self.sort.get_data(EARLIEST)
            self.assertEqual(1 - i, sorted_data[0]['upvote'])

    def test_post_upvote_affect_only_one_review(self):
        """POST request should affect only one review."""
        test_data = [
            {"email": "solaire@gmail.com",
             "id": self.review[0].review_id},

            {"email": "logan@gmail.com",
             "id": self.review[0].review_id},

            {"email": "laurentius@gmail.com",
             "id": self.review[0].review_id},
        ]

        for i in range(len(test_data)):
            self.upvote.post_data(test_data[i])

            sorted_data = self.sort.get_data(EARLIEST)

            self.assertEqual(i + 1, sorted_data[0]['upvote'])
            self.assertEqual(0, sorted_data[1]['upvote']
                             )
