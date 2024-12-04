"""Module for test everything that relate to User Account."""

import json

from django.test import TestCase

from .set_up import user_set_up
from ..db_post import UserDataPost
from ..db_put import UserDataPut
from ..db_query import UserQuery
from ..models.user_model import UserData


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
                         {"error": "email is missing from the request body."})

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


class UserQueryTest(TestCase):
    """Test cases for GET request."""

    def setUp(self):
        """Set up for every test."""
        self.user_query = UserQuery()
        self.user = user_set_up()

    def test_user_id_correct_output(self):
        """Frontend dev can use user_id to get the data."""
        user = self.user[0]
        result = self.user_query.get_data(
            {"email": None, "user_id": user.user_id}
        )

        expect = {
            "id": user.user_id,
            "username": user.user_name,
            "desc": user.description,
            "pf_color": user.profile_color,
            "profile_link": None,
            "following": [],
            "follower": [],
            "follower_count": 0,
            "following_count": 0,
        }
        self.assertEqual(result, expect)

    def test_email_correct_output(self):
        """Frontend dev can use email to get the data."""
        user = self.user[0]
        result = self.user_query.get_data(
            {"email": user.email, "user_id": None}
        )

        expect = {
            "id": user.user_id,
            "username": user.user_name,
            "desc": user.description,
            "pf_color": user.profile_color,
            "profile_link": None,
            "following": [],
            "follower": [],
            "follower_count": 0,
            "following_count": 0,
        }
        self.assertEqual(result, expect)

    def test_email_and_id_correct_output(self):
        """Frontend dev can use both key to get the data."""
        user = self.user[0]
        result = self.user_query.get_data(
            {"email": user.email, "user_id": user.user_id}
        )

        expect = {
            "id": user.user_id,
            "username": user.user_name,
            "desc": user.description,
            "pf_color": user.profile_color,
            "profile_link": None,
            "following": [],
            "follower": [],
            "follower_count": 0,
            "following_count": 0,
        }
        self.assertEqual(result, expect)


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

    def test_response_user_name_already_exist(self):
        """Data provided user_name that is already exist."""
        self.user_data['user_id'] = 1
        response = self.user_put.put_data(self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                         "This username was taken.")
        
    def test_response_user_id_doesnt_exist(self):
        """Data provided user_id that doesn't exist."""
        self.user_data['user_id'] = 1
        self.user_data['user_name'] = 'user that no one uses'
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
        self.user_data['user_id'] = 9999
        self.user_data['user_name'] = 'no one took this name yet'
        response = self.user_put.put_data(self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], "The User with that ID does not exists.")
