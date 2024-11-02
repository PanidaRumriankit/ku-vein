"""Module for test Follower Following feature."""

from ..models import FollowData
from ..db_query import UserQuery
from .set_up import user_set_up, follower_setup
from django.test import TestCase


class FollowerFeatureTest(TestCase):
    """Class for test follower feature."""

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
