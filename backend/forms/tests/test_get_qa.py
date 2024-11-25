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

    def test_get_all_question_latest(self):
        """Test normal get from /qa?mode=latest with no arguments."""
        response = self.Qquery.get_data(mode='latest')
        self.assertEqual(json.loads(response.content), self.questions[::-1])

    def test_get_all_question_oldest(self):
        """Test normal get from /qa?mode=oldest with no arguments."""
        response = self.Qquery.get_data(mode='earliest')
        self.assertEqual(json.loads(response.content), self.questions)

    def test_get_all_question_upvote(self):
        """Test normal get from /qa?mode=upvote with no arguments."""
        response = self.Qquery.get_data(mode='upvote')
        self.assertEqual(json.loads(response.content), self.questions[::-1])
    


class AnswerGetTest(TestCase):
    """Class for test Get answer."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.Qquery = QuestionQuery()
        self.Aquery = AnswerQuery()
        self.questions, self.answers = qa_setup()

    def test_get_answer_for_question_latest(self):
        """Test normal get from /qa?mode=latest with question_id arguments."""
        response = self.Aquery.get_data(question_id=self.questions[0]['questions_id'], mode='latest')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), self.answers[0][::-1])

    def test_get_answer_for_question_oldest(self):
        """Test normal get from /qa?mode=oldest with question_id arguments."""
        response = self.Aquery.get_data(question_id=self.questions[0]['questions_id'], mode='earliest')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), list(self.answers[0]))

    def test_get_answer_for_question_upvote(self):
        """Test normal get from /qa?mode=upvote with question_id arguments."""
        response = self.Aquery.get_data(question_id=self.questions[0]['questions_id'], mode='upvote')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content), self.answers[0][::-1])

    def test_get_answer_for_non_existent_question(self):
        """Test get from /qa with non-existent question_id arguments."""
        response = self.Aquery.get_data(question_id=99, mode='latest')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], "This question isn't in the database.")
