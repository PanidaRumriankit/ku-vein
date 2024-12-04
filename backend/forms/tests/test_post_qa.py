"""Module for test POST Q&A feature."""
import json

from django.test import TestCase

from .set_up import qa_setup
from ..db_post import QuestionPost, AnswerPost
from ..models.course_data_model import CourseData
from ..models.user_model import UserData


class QuestionPostTest(TestCase):
    """Class for test POST question."""
    def setUp(self):
        """Set up reusable instances for tests."""
        self.user = UserData.objects.create(
            user_name='test user',
            user_type='student',
            email='test email yes'
        )
        self.Qpost = QuestionPost()
        self.Apost = AnswerPost()
        test_course = CourseData.objects.create(course_id='000000-00',course_name='test', course_type='test')
        self.question = {
            "question_title": "Test title",
            "question_text": "Test question",
            "faculty": "test",
            "user_id": self.user.user_id,
            "pen_name": self.user.user_name,
            "is_anonymous": False,
            "course_id": test_course.course_id,
            "course_type": test_course.course_type,
        }

    def test_post_question(self):
        """Test normal post to /qa."""
        response = self.Qpost.post_data(self.question)
        self.assertEqual(json.loads(response.content)['success'], "QA_Question created successfully.")
        self.assertEqual(response.status_code, 201)

    def test_post_bad_question(self):
        """Test bad post to /qa."""
        del self.question['user_id']
        response = self.Qpost.post_data(self.question)
        self.assertEqual(json.loads(response.content)['error'], "Data is missing from the request body.")
        self.assertEqual(response.status_code, 400)

    def test_post_question_but_bad_course(self):
        """Test post to /qa but with wrong course id"""
        self.question['course_id'] = 123
        response = self.Qpost.post_data(self.question)
        self.assertEqual(json.loads(response.content)['error'], "This course isn't in the database.")
        self.assertEqual(response.status_code, 400)

class AnswerPostTest(TestCase):
    """Class for test POST answer."""

    def setUp(self):
        self.questions, self.answers = qa_setup()
        self.user = UserData.objects.create(
            user_name='test user too',
            user_type='student',
            email='test email yes right'
        )
        self.Qpost = QuestionPost()
        self.Apost = AnswerPost()
        self.answer = {
            'question_id': self.questions[0]['questions_id'],
            'answer_text': 'Test answer',
            'user_id': self.user.user_id,
            "pen_name": self.user.user_name,
            "is_anonymous": False
        }

    def test_post_answer(self):
        """Test normal post to /qa/answer."""
        response = self.Apost.post_data(self.answer)
        self.assertEqual(json.loads(response.content)['success'], "QA_Answer created successfully.")
        self.assertEqual(response.status_code, 201)

    def test_missing_field_post_answer(self):
        del self.answer['user_id']
        response = self.Apost.post_data(self.answer)
        self.assertEqual(json.loads(response.content)['error'], "Data is missing from the request body.")
        self.assertEqual(response.status_code, 400)

    def test_bad_user_id_post_answer(self):
        self.answer['user_id'] = 9876
        response = self.Apost.post_data(self.answer)
        self.assertEqual(json.loads(response.content)['error'], "This user isn't in the database.")
        self.assertEqual(response.status_code, 400)

    def test_bad_question_id_post_answer(self):
        self.answer['question_id'] = 9876
        response = self.Apost.post_data(self.answer)
        self.assertEqual(json.loads(response.content)['error'], "This question isn't in the database.")
        self.assertEqual(response.status_code, 400)
