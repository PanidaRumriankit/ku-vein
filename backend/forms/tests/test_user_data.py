"""Module for test everything that relate to User Account."""

import json

from ..models import UserData
from ..db_post import UserDataPost
from ..db_put import UserDataPut
from django.test import TestCase
import copy


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

class UserDataPutTest(TestCase):
    """Testcases for PUT request."""

    def setUp(self):
        """Set up for every test."""
        self.user_put = UserDataPut()
        self.user_data = {'user_name': 'banana',
                          'user_type': 'student',
                          'email': 'banana.ba@ku.th',
                          'description': 'bananalonglong',
                          'profile_color': 'Yellow'}
        UserData.objects.create(**self.user_data)
        self.user = UserData.objects.get(user_name='banana')
        self.user_data['user_id'] = self.user.user_id

    def test_response_missing_data_attribute(self):
        """Missing an attribute in data body ('user_type')."""
        del self.user_data['user_type']
        response = self.user_put.put_data(self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                         "Some attribute is missing from the data.")
        
    def test_response_user_doesnt_exist(self):
        """Data provided user_id that doesn't match any user."""
        self.user_data['user_id'] = 9999
        response = self.user_put.put_data(self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                         "The User with that ID does not exists.")

    def test_response_successful_put(self):
        """
        Sucessful PUT request handling.

        Note: When django user 'save()' django creates a whole new object making previos instance of user outdated.
        """
        self.user_data['user_name'] = 'Monkey'
        response = self.user_put.put_data(self.user_data)
        self.assertEqual(json.loads(response.content)['success'], "The requested user's attribute has been changed.")
        self.assertEqual(response.status_code, 200)
        self.user = UserData.objects.get(user_name=self.user_data['user_name'])
        self.assertEqual(self.user.user_name, self.user_data['user_name'])

    def test_response_non_existent_user(self):
        """Non existent user in PUT request."""
        self.user_data['user_id'] = 2
        response = self.user_put.put_data(self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], "The User with that ID does not exists.")
