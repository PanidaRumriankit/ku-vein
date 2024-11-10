"""Module for test POST Follower feature."""

import json
from ..db_post import FollowPost
from ..models import FollowData
from django.db.models import F
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

    def test_response_unfollow_success(self):
        """Successfully unfollow the user."""
        self.post.post_data({
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": self.user_ins[1].user_id
        })

        response = self.post.post_data({
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": self.user_ins[1].user_id
        })

        self.assertEqual(response.status_code, 201)

        self.assertEqual(json.loads(response.content),
                         {"success": "Successfully"
                                     " Unfollow the user."})

    def test_response_follow_success(self):
        """Successfully follow the user."""
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
            {"this_user": data.follow_by, "follow_by": data.this_user}
            for data in FollowData.objects.all()
        ]

        expected_data = [
            {"this_user": expected.user_id,
             "follow_by": self.user_ins[0].user_id}
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
            {"this_user": data.follow_by, "follow_by": data.this_user}
            for data in FollowData.objects.all()
        ]

        expected_data = [
            {"this_user": self.user_ins[0].user_id,
             "follow_by": expected.user_id}
            for expected in self.user_ins[1:]
        ]

        self.assertEqual(result_data, expected_data)

    def test_unfollow(self):
        """
        If same user got POST second time.

        Then, user should unfollow the target user.
        """
        test_data = {
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": self.user_ins[1].user_id
        }

        self.post.post_data(test_data)

        self.post.post_data(test_data)

        self.assertFalse(FollowData.objects.all().exists())

        self.post.post_data(test_data)

        self.assertEqual(
            test_data,
            FollowData.objects.values(
                current_user_id=F('follow_by_id'),
                target_user_id=F('this_user_id')
            ).first()
        )

        # User can follow to diff user after unfollow
        self.post.post_data({
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": self.user_ins[2].user_id
        })

        self.assertEqual({
            "current_user_id": self.user_ins[0].user_id,
            "target_user_id": self.user_ins[2].user_id},

            FollowData.objects.values(
                current_user_id=F('follow_by_id'),
                target_user_id=F('this_user_id')
            )[1]
        )
