"""Test case for get the Note data."""

from django.test import TestCase

from .set_up import user_set_up, course_set_up, note_setup
from ..db_query import NoteQuery


class NoteQueryTests(TestCase):
    """Test case for Note feature."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.note_query = NoteQuery()

        self.course, self.course_data = course_set_up()
        self.user = user_set_up()


    def test_get_data(self):
        """It should return correct key."""
        note_setup(self.course, self.user)

        filter_key = {
            'course_id': None,
            'faculty': None,
            'course_type': None,
            'email': None
        }

        note_data = self.note_query.get_data(filter_key)

        self.assertIsInstance(note_data, list)
        self.assertIsInstance(note_data[0], dict)
        self.assertIn('courses_id', note_data[0])
        self.assertIn('courses_name', note_data[0])
        self.assertIn('faculties', note_data[0])
        self.assertIn('courses_type', note_data[0])
        self.assertIn('u_id', note_data[0])
        self.assertIn('name', note_data[0])
        self.assertIn('is_anonymous', note_data[0])
        self.assertIn('pdf_path', note_data[0])
        self.assertIn('pdf_name', note_data[0])


    def test_output_correct_value(self):
        """It should output correct value."""
        note = note_setup(self.course, self.user)

        filter_key = {
            'course_id': None,
            'faculty': None,
            'course_type': None,
            'email': None
        }

        note_data = self.note_query.get_data(filter_key)
        self.assertIn('note_files', note_data[0]['pdf_file'])
        self.assertTrue(note_data[0]['pdf_file'].endswith('.pdf'))
        self.assertEqual(note_data[0]['courses_id'], self.course[0].course_id)
        self.assertEqual(note_data[0]['faculties'], note.faculty)
        self.assertEqual(note_data[0]['courses_type'], self.course[0].course_type)
        self.assertEqual(note_data[0]['u_id'], self.user[0].user_id)
        self.assertEqual(note_data[0]['name'], 'Yes')
