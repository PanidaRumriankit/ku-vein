import json

from ..models import UserData
from ..db_post import UserDataPost
from django.test import TestCase


def user_set_up():
    """Set Up function for user data."""

    user = []

    user_test_data = [
        {"user_name": "Solaire of Astora", "user_type": "Knight", "email": "solaire@gmail.com"},
        {"user_name": "Siegmeyer of Catarina", "user_type": "Knight", "email": "siegmeyer@gmail.com"},
        {"user_name": "Lucatiel of Mirrah ", "user_type": "Knight", "email": "aslatiel@gmail.com"},
        {"user_name": "Big Hat Logan", "user_type": "Sorcerer", "email": "logan@gmail.com"},
        {"user_name": "Laurentius of the Great Swamp", "user_type": "Pyromancer", "email": "laurentius@gmail.com"}
    ]

    for add_user in user_test_data:
        user.append(UserData.objects.create(**add_user))

    return user


class UserDataPostTests(TestCase):
    """Test cases for LatestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.user = UserDataPost()

    def test_response_missing_user_data(self):
        """Missing email key in the response body."""
        response = self.user.post_data({})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content), {"error": "email is missing from the response body."})

    def test_response_success(self):
        """Created User successes."""
        response = self.user.post_data({"email": "siegmeyer@gmail.com"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content), {"success": "The User is successfully created."})

    def test_default_user_name(self):
        """The default name of the user should be user_{number of user in the database}."""

        user_test_data = [
            {"email": "solaire@gmail.com"},  {"email": "aslatiel@gmail.com"},
            {"email": "laurentius@gmail.com"}, {"email": "siegmeyer@gmail.com"}
        ]

        for add_user in user_test_data:
            self.user.post_data(add_user)

        for i, user in enumerate(UserData.objects.all()):
            self.assertEqual(user.user_name, f"user_{i}")

    def test_default_user_type(self):
        """The default type of the user should be student."""

        user_test_data = [
            {"email": "solaire@gmail.com"},  {"email": "aslatiel@gmail.com"},
            {"email": "laurentius@gmail.com"}, {"email": "siegmeyer@gmail.com"}
        ]

        for add_user in user_test_data:
            self.user.post_data(add_user)

        for i, user in enumerate(UserData.objects.all()):
            self.assertEqual(user.user_type, "student")

    def test_correct_email(self):
        """The default type of the user should be student."""

        user_test_data = [
            {"email": "solaire@gmail.com"}, {"email": "aslatiel@gmail.com"},
            {"email": "laurentius@gmail.com"}, {"email": "siegmeyer@gmail.com"}
        ]

        for add_user in user_test_data:
            self.user.post_data(add_user)

        for i, user in enumerate(UserData.objects.all()):
            self.assertEqual(user.email, user_test_data[i]['email'])
