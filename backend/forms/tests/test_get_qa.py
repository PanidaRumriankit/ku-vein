"""Module for test GET Q&A feature."""
import json

from ..db_query import QuestionQuery, AnswerQuery
from .set_up import qa_setup
from django.test import TestCase


class QuestionGetTest(TestCase):
    """Class for test GET question."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.Qquery = QuestionQuery()
        self.Aquery = AnswerQuery()
        self.questions, self.answers = qa_setup()

    def test_get_all_question(self):
        """Test normal get from /qa with no arguments."""
        self.assertEqual(self.Qquery.get_data(), self.questions)


class AnswerGetTest(TestCase):
    """Class for test Get answer."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.Qquery = QuestionQuery()
        self.Aquery = AnswerQuery()
        self.questions, self.answers = qa_setup()

    def test_get_answer_for_a_question(self):
        """Test normal get from /qa with question_id arguments."""
        response = self.Aquery.get_data(question_id=1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), [self.answers[0]])

    def test_get_answer_for_non_existent_question(self):
        """Test get from /qa with non-existent question_id arguments."""
        response = self.Aquery.get_data(question_id=99)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], "This question isn't in the database.")
