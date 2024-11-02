"""Module for test Follower Following feature."""

import json
from ..db_post import FollowPost
from ..models import FollowData
from ..db_query import UserQuery
from .set_up import user_set_up, follower_setup
from django.test import TestCase


class FollowerGetTest(TestCase):
    """Class for test GET follower."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.user = UserQuery()
        self.user_ins = user_set_up()
        follower_setup(self.user_ins)

    def test_default_following(self):
        """There should be following empty list in default."""
        default_following = self.user.get_data(self.user_ins[0].email)
        self.assertEqual([], default_following['following'])

    def test_default_follower(self):
        """There should be follower empty list in default."""
        for everyone in self.user_ins[1:]:
            default_following = self.user.get_data(everyone.email)
            self.assertEqual([], default_following['follower'])

    def test_everyone_followed(self):
        """
        In setup everyone followed first guy.

        Everyone name should appear in follower list of the first guy.
        """
        all_followed = self.user.get_data(self.user_ins[0].email)
        self.assertEqual([
            {'username': 'Siegmeyer of Catarina', 'desc': ''},
            {'username': 'Lucatiel of Mirrah', 'desc': ''},
            {'username': 'Big Hat Logan', 'desc': ''},
            {'username': 'Laurentius of the Great Swamp', 'desc': ''}
        ],
            all_followed['follower'])

    def test_follower_update_when_create_new_following(self):
        """Data should be update when new objects got created."""
        FollowData.objects.create(
            this_user=self.user_ins[1],
            follow_by=self.user_ins[2]
        )

        new_follower = self.user.get_data(self.user_ins[1].email)
        new_following = self.user.get_data(self.user_ins[2].email)

        self.assertTrue(
            any(follower['username'] == "Lucatiel of Mirrah"
                for follower in new_follower['follower']),
            "Expected 'Lucatiel of Mirrah' to be a follower"
        )

        self.assertTrue(
            any(following['username'] == "Siegmeyer of Catarina"
                for following in new_following['following']),
            "Expected 'Siegmeyer of Catarina' to be following"
        )


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
