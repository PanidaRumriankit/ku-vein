"""Module for test everything that relate to User Account."""

import json

from ..models import UserData
from ..db_post import UserDataPost
from django.test import TestCase


class UserDataPostTests(TestCase):
    """Test cases for LatestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.user = UserDataPost()

    def test_response_missing_user_data(self):
        """Missing email key in the response body."""
        response = self.user.post_data({})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "email is missing from the response body."})

    def test_response_success(self):
        """Created User successes."""
        response = self.user.post_data({"email": "siegmeyer@gmail.com"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {"success": "The User is successfully created."})

    def test_default_user_name(self):
        """Default name of the user should be user_{len(user)}."""
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
