"""Test case for create Note feature."""

import os
import base64
import json

from django.test import TestCase
from django.conf import settings
from ..models import Note
from ..db_post import NotePost
from .set_up import user_set_up, course_set_up


class NotePostTests(TestCase):
    """Test case for Note feature."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.note_post = NotePost()

        self.course, self.course_data = course_set_up()
        self.user = user_set_up()

        path = os.path.join(settings.MEDIA_ROOT,
                            'note_files', 'yes_indeed.pdf')

        with open(path, "rb") as f:
            test_pdf = f.read()

        self.fake_pdf = base64.b64encode(test_pdf).decode('utf-8')


    def tearDown(self):
        """Clean up any files created during the test."""
        for i in range(6):
            if i == 0:
                file_path = os.path.join(settings.MEDIA_ROOT, 'note_files', 'please_work.pdf')
            else:
                file_path = os.path.join(settings.MEDIA_ROOT, 'note_files', f'please_work({i}).pdf')

            if os.path.isfile(file_path):
                os.remove(file_path)

    def test_response_missing_email(self):
        """Test missing email key in response body."""
        test_data = {
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "pen_name": "Yes",
            "course_type": self.course_data[0]['course_type'],
            "file_name": "please_work",
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "Data is missing "
                                   "from the response body."})

    def test_response_missing_course_id(self):
        """Test missing course_id key in response body."""
        test_data = {
            "email": self.user[0].email,
            "faculty": "banana",
            "pen_name": "Yes",
            "course_type": self.course_data[0]['course_type'],
            "file_name": "please_work",
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "Data is missing "
                                   "from the response body."})

    def test_response_missing_faculty(self):
        """Test missing faculty key in response body."""
        test_data = {
            "email": self.user[0].email,
            "course_id": self.course_data[0]['course_id'],
            "pen_name": "Yes",
            "course_type": self.course_data[0]['course_type'],
            "file_name": "please_work",
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "Data is missing "
                                   "from the response body."})

    def test_response_missing_course_type(self):
        """Test missing course_type key in response body."""
        test_data = {
            "email": self.user[0].email,
            "pen_name": "Yes",
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "file_name": "please_work",
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "Data is missing "
                                   "from the response body."})

    def test_response_missing_file(self):
        """Test missing file key in response body."""
        test_data = {
            "email": self.user[0].email,
            "pen_name": "Yes",
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "file_name": "please_work",
            "course_type": self.course_data[0]['course_type'],
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "File is missing."})

    def test_course_does_not_in_the_database(self):
        """Test course data isn't in the database."""
        test_data = {
            "email": self.user[0].email,
            "course_id": "69",
            "pen_name": "Yes",
            "faculty": "banana",
            "file_name": "please_work",
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This course"
                                   " isn't in the database."})

    def test_user_does_not_in_the_database(self):
        """Test user data isn't in the database."""
        test_data = {
            "email": "iwanttorest@gmail.com",
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "pen_name": "Yes",
            "file_name": "please_work",
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This user isn't "
                                   "in the database."})

    def test_successfully_post_note(self):
        """
        Everything is perfect.

        It should save the data without problem.
        """
        test_data = {
            "email": self.user[0].email,
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "pen_name": "Yes",
            "file_name": "please_work",
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {"success": "Note"
                                     " created successfully."})

    def test_post_note(self):
        """This should successfully create the note."""
        test_data = {
            "email": self.user[0].email,
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "pen_name": "Yes",
            "file_name": "please_work",
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        self.note_post.post_data(test_data)

        note = Note.objects.first()

        self.assertEqual(note.course.course_name,
                         self.course_data[0]['course_name'])
        self.assertEqual(note.user.user_name, self.user[0].user_name)

        self.assertIn("note_files",
                      note.note_file.name.replace(
                          "/", "|"
                      ).replace("\\", "|").split("|"))

        self.assertTrue(note.note_file.name.endswith('.pdf'))

    def test_same_name_note(self):
        """Name should be change if this name already exist."""
        test_data = {
            "email": self.user[0].email,
            "course_id": self.course_data[0]['course_id'],
            "faculty": "banana",
            "pen_name": "Yes",
            "file_name": "please_work",
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        for i in range(5):
            self.note_post.post_data(test_data)

            if not i:
                self.assertEqual("please_work.pdf",
                                 Note.objects.first().file_name)
            else:
                self.assertEqual(f"please_work({i}).pdf",
                                 Note.objects.all()[i].file_name)

