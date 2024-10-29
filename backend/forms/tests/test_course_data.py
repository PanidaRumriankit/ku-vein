"""Module for test everything relate to CourseData Table."""

from ..models import CourseData, Inter, Special, Normal
from ..db_query import InterQuery, NormalQuery, SpecialQuery, CourseQuery
from django.test import TestCase

TEST_DATA = [
        {"course_id": "1", "faculty": "Miracle",
         "course_type": "Priest", "course_name": "Basic Miracle 1"},

        {"course_id": "2", "faculty": "Sorcery",
         "course_type": "Sorcerer", "course_name": "Soul Arrow Mastery"},

        {"course_id": "3", "faculty": "Pyromancy",
         "course_type": "Pyromancer", "course_name": "Flame Manipulation"},

        {"course_id": "4", "faculty": "Hexes",
         "course_type": "Hexer", "course_name": "Dark Orb Fundamentals"},

        {"course_id": "5", "faculty": "Faith",
         "course_type": "Knight", "course_name": "Sacred Oath"},
    ]


def course_set_up():
    """Set Up function for course data."""
    course = []

    test_data = TEST_DATA

    for insert_data in test_data:
        course.append(CourseData.objects.create(**insert_data))

    return course


class CourseQueryTests(TestCase):
    """Test case for CourseQuery class."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.course = CourseQuery()
        self.course_data = course_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        expected_data = TEST_DATA

        expected_values = [list(sorted(item.values()))
                           for item in expected_data]
        result_values = [list(sorted(item.values()))
                         for item in self.course.get_data()]

        self.assertEqual(result_values, expected_values)


class InterQueryTests(TestCase):
    """Test cases for InterQuery class.."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.inter = InterQuery()

        self.course = course_set_up()

        for course in self.course:
            Inter.objects.create(course=course)

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.inter.get_data(), list)

    def test_correct_data_output(self):
        """send_all_course_data() should return the course data."""
        expected_data = TEST_DATA

        expected_values = [list(sorted(item.values()))
                           for item in expected_data]
        result_values = [list(sorted(item.values()))
                         for item in self.inter.get_data()]

        self.assertEqual(result_values, expected_values)


class SpecialQueryTests(TestCase):
    """Test cases for SpecialQuery."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.special = SpecialQuery()

        self.course = course_set_up()

        for course in self.course:
            Special.objects.create(course=course)

    def test_correct_data_format(self):
        """Data should return as a list."""
        expected_data = TEST_DATA

        expected_values = [list(sorted(item.values()))
                           for item in expected_data]
        result_values = [list(sorted(item.values()))
                         for item in self.special.get_data()]

        self.assertEqual(result_values, expected_values)


class NormalQueryTests(TestCase):
    """Test cases for NormalQuery."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.normal = NormalQuery()

        self.course = course_set_up()

        for course in self.course:
            Normal.objects.create(course=course)

    def test_correct_data_format(self):
        """Data should return as a list."""
        expected_data = TEST_DATA

        expected_values = [list(sorted(item.values()))
                           for item in expected_data]
        result_values = [list(sorted(item.values()))
                         for item in self.normal.get_data()]

        self.assertEqual(result_values, expected_values)
