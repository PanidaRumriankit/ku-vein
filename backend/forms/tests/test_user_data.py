from ..models import CourseData, UserData, CourseReview
from ..db_query import EarliestReview
from ..db_post import UserDataPost, ReviewPost
from django.test import TestCase
from .test_course_data import course_set_up

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