# pylint: skip-file
# -1: [file-ignored]

from ..models import CourseData
from ..db_query import DatabaseQuery
from ..db_post import UserDataPost, ReviewPost
from ..db_management import DatabaseManagement
from django.test import TestCase


class InterQueryTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.inter = DatabaseQuery()

        data = {"course_id":"1", "faculty":"Miracle", "course_type":"Priest", "course_name":"Basic Miracle 1"}
        CourseData.objects.create(**data)

    def test_correct_data_format(self):
        """Data should return as a list."""
        print(CourseData.objects.all())
        self.assertEqual(self.inter.send_all_course_data(), [])

