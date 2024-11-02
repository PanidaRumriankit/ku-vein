"""Module for test POST Follower feature."""

import json
from ..db_post import FollowPost
from ..models import FollowData
from .set_up import user_set_up
from django.test import TestCase

class FollowPostTest(TestCase):
    """Class for test POST follower."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.post = FollowPost()
        self.follow = FollowData()
        self.user_ins = user_set_up()

    def test_response_missing_current_user_id(self):
        """Data missing current_user_id key."""
        response = self.post.post_data({
            "target_user_id": self.user_ins[0].user_id
        })

        self.assertEqual(response.status_code, 400)

        self.assertEqual(json.loads(response.content),
                         {"error": "current_user_id or target_user_id"
                                   " are missing from the response body."})

    def test_response_missing_target_user_id(self):
        """Data missing target_user_id key."""
        response = self.post.post_data({
            "current_user_id": self.user_ins[0].user_id
        })

        self.assertEqual(response.status_code, 400)

        self.assertEqual(json.loads(response.content),
                         {"error": "current_user_id or target_user_id"
                                   " are missing from the response body."})

    def test_response_cur_user_not_in_the_database(self):
        """Current_user_id isn't in the database."""
        response = self.post.post_data({
            "current_user_id": 69,
            "target_user_id": self.user_ins[0].user_id
        })

        self.assertEqual(response.status_code, 401)

        self.assertEqual(json.loads(response.content),
                         {"error": "This user isn't "
                                   "in the database."})

    def test_response_target_user_not_in_the_database(self):
        """Target_user_id isn't in the database."""
        response = self.post.post_data({
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": 69
        })

        self.assertEqual(response.status_code, 401)

        self.assertEqual(json.loads(response.content),
                         {"error": "Target user isn't "
                                   "in the database."})

    def test_response_success(self):
        """Successfully post the data."""
        response = self.post.post_data({
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": self.user_ins[1].user_id
        })

        self.assertEqual(response.status_code, 201)

        self.assertEqual(json.loads(response.content),
                         {"success": "Successfully add follower data."})

    def test_post_following(self):
        """This user follow everyone."""
        for i in range(len(self.user_ins) - 1):

            self.post.post_data({
                "current_user_id": self.user_ins[0].user_id,
                "target_user_id": self.user_ins[i + 1].user_id
            })

        result_data = [
            {"this_user": data.this_user, "follow_by": data.follow_by}
            for data in FollowData.objects.all()
        ]

        expected_data = [
            {"this_user": self.user_ins[0], "follow_by": expected}
            for expected in self.user_ins[1:]
        ]

        self.assertEqual(result_data, expected_data)

    def test_post_follower(self):
        """This user got followed by everyone."""
        for i in range(len(self.user_ins) - 1):

            self.post.post_data({
                "current_user_id": self.user_ins[i + 1].user_id,
                "target_user_id": self.user_ins[0].user_id
            })

        result_data = [
            {"this_user": data.this_user, "follow_by": data.follow_by}
            for data in FollowData.objects.all()
        ]

        expected_data = [
            {"this_user": expected, "follow_by": self.user_ins[0]}
            for expected in self.user_ins[1:]
        ]

        self.assertEqual(result_data, expected_data)
