import json

from django.core.files.uploadedfile import SimpleUploadedFile
from ..db_post import NotePost
from django.test import TestCase
from .set_up import user_set_up, course_set_up


class NotePostTests(TestCase):
    """Test case for Note feature."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.note_post = NotePost()

        self.course_data = course_set_up()[1]
        self.user = user_set_up()
        self.fake_pdf = SimpleUploadedFile(
            "test_note.pdf",
            b"PDF content here", content_type="application/pdf"
        )

    def test_response_missing_email(self):
        """Test missing email key in response body."""
        test_data = {
            "course_id": self.course_data[0]['course_id'],
            "faculty":  self.course_data[0]['faculty'],
            "course_type": self.course_data[0]['course_type'],
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
            "faculty": self.course_data[0]['faculty'],
            "course_type": self.course_data[0]['course_type'],
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
            "course_type": self.course_data[0]['course_type'],
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
            "course_id": self.course_data[0]['course_id'],
            "faculty": self.course_data[0]['faculty'],
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
            "course_id": self.course_data[0]['course_id'],
            "faculty": self.course_data[0]['faculty'],
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
            "faculty": self.course_data[0]['faculty'],
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "Course"
                                   " isn't in the database."})

    def test_user_does_not_in_the_database(self):
        """Test user data isn't in the database."""
        test_data = {
            "email": "iwanttorest@gmail.com",
            "course_id": "1",
            "faculty": self.course_data[0]['faculty'],
            "course_type": self.course_data[0]['course_type'],
            "file": self.fake_pdf
        }
        response = self.note_post.post_data(test_data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This course isn't "
                                   "in the database."})
