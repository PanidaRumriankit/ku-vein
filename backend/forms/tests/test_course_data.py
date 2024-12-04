"""Module for test everything that relate to CourseData Table."""

from ..models.course_data_model import CourseData, Inter, Special, Normal
from ..db_query import InterQuery, NormalQuery, SpecialQuery, CourseQuery
from .set_up import course_set_up
from django.test import TestCase


class CourseQueryTests(TestCase):
    """Test case for CourseQuery class."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.course = CourseQuery()
        self.course_data, self.data = course_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        expected_data = self.data

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

        self.course, self.data = course_set_up()

        for course in self.course:
            Inter.objects.create(course=course)

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.inter.get_data(), list)

    def test_correct_data_output(self):
        """send_all_course_data() should return the course data."""
        expected_data = self.data

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

        self.course, self.data = course_set_up()

        for course in self.course:
            Special.objects.create(course=course)

    def test_correct_data_format(self):
        """Data should return as a list."""
        expected_data = self.data

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

        self.course, self.data = course_set_up()

        for course in self.course:
            Normal.objects.create(course=course)

    def test_correct_data_format(self):
        """Data should return as a list."""
        expected_data = self.data

        expected_values = [list(sorted(item.values()))
                           for item in expected_data]
        result_values = [list(sorted(item.values()))
                         for item in self.normal.get_data()]

        self.assertEqual(result_values, expected_values)
