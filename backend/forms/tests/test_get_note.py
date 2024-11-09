"""Test case for get the Note data."""

import os
import json

from ..models import Note
from ..db_query import NoteQuery
from django.test import TestCase
from django.conf import settings
from .set_up import user_set_up, course_set_up, note_setup


class NoteQueryTests(TestCase):
    """Test case for Note feature."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.note_post = NoteQuery()

        self.course, self.course_data = course_set_up()
        self.user = user_set_up()
        self.note = note_setup(self.course, self.user)

    def tearDown(self):
        """Clean up any files created during the test."""
        note = Note.objects.first()
        if note and note.note_file:
            file_path = os.path.join(settings.MEDIA_ROOT, note.note_file.name)
            if os.path.isfile(file_path):
                os.remove(file_path)