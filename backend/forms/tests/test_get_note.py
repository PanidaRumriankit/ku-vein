"""Test case for get the Note data."""

import os

from django.conf import settings
from django.test import TestCase

from .set_up import user_set_up, course_set_up, note_setup
from ..db_query import NoteQuery
from ..models import Note


class NoteQueryTests(TestCase):
    """Test case for Note feature."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.note_query = NoteQuery()

        self.course, self.course_data = course_set_up()
        self.user = user_set_up()


    def test_get_data(self):
        """It should return correct key."""
        note = note_setup(self.course, self.user)

        filter_key = {
            'course_id': self.course[0].course_id,
            'faculty': note.faculty,
            'course_type': self.course[0].course_type,
            'email': self.user[0].email
        }

        note_data = self.note_query.get_data(filter_key)

        self.assertIsInstance(note_data, dict)
        self.assertIn('courses_id', note_data)
        self.assertIn('courses_name', note_data)
        self.assertIn('faculties', note_data)
        self.assertIn('courses_type', note_data)
        self.assertIn('u_id', note_data)
        self.assertIn('name', note_data)
        self.assertIn('is_anonymous', note_data)
        self.assertIn('pdf_path', note_data)
        self.assertIn('pdf_name', note_data)


    def test_output_correct_value(self):
        """It should output correct value."""
        note = note_setup(self.course, self.user)

        filter_key = {
            'course_id': self.course[0].course_id,
            'faculty': note.faculty,
            'course_type': self.course[0].course_type,
            'email': self.user[0].email
        }

        note_data = self.note_query.get_data(filter_key)
        self.assertIn('note_files', note_data['pdf_file'])
        self.assertTrue(note_data['pdf_file'].endswith('.pdf'))
        self.assertEqual(note_data['courses_id'], self.course[0].course_id)
        self.assertEqual(note_data['faculties'], note.faculty)
        self.assertEqual(note_data['courses_type'], self.course[0].course_type)
        self.assertEqual(note_data['u_id'], self.user[0].user_id)
        self.assertEqual(note_data['name'], 'Yes')
