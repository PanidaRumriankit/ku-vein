"""Module for testing PUT requests that were made to Note"""
import json

from django.test import TestCase

from .set_up import note_setup, user_set_up, course_set_up
from ..db_put import NotePut
from ..models import Note


class QuestionPutTest(TestCase):
    """Testcases for PUT request to question."""

    def setUp(self):
        """Set up for every test."""
        course, course_data = course_set_up()
        user = user_set_up()
        self.note: Note = note_setup(course, user)
        self.note_put = NotePut()
        self.note_put_dict = {
            "note_id": self.note.note_id,
            "faculty": "test",
            "pen_name": self.note.user.user_name,
        }

    def test_response_successful_put(self):
        """Sucessful PUT request handling."""
        self.note_put_dict['pen_name'] = 'The Monkey'
        response = self.note_put.put_data(self.note_put_dict)
        self.assertEqual(json.loads(response.content)['success'], "The requested note's attribute has been changed.")
        self.assertEqual(response.status_code, 200)
        self.note = Note.objects.get(note_id=self.note_put_dict['note_id'])
        self.assertEqual(self.note.pen_name, self.note_put_dict['pen_name'])

    def test_response_missing_data_attribute(self):
        """Missing an attribute in data body ('note_id')."""
        del self.note_put_dict['note_id']
        response = self.note_put.put_data(self.note_put_dict)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                         "Some crucial attributes are missing from the data.")
        
    def test_response_noten_id_doesnt_exist(self):
        """Data provided note_id that doesn't exist."""
        self.note_put_dict['note_id'] = 9999
        self.note_put_dict['pen_name'] = 'OOGABOOGA_BANANA'
        response = self.note_put.put_data(self.note_put_dict)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                            "The Note with that ID does not exists.")

