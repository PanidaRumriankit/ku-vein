"""Module for testing PUT requests that were made to Q&A"""
import json

from .set_up import qa_setup
from ..models import QA_Question, QA_Answer, UserData
from ..db_put import QA_QuestionPut, QA_AnswerPut
from django.test import TestCase

class QuestionPutTest(TestCase):
    """Testcases for PUT request to question."""

    def setUp(self):
        """Set up for every test."""
        qa_setup()
        self.question_put = QA_QuestionPut()
        self.question = QA_Question.objects.all()[0]
        self.question_put_dict = {
            "question_id": self.question.question_id,
            "question_title": self.question.question_title,
            "question_text": self.question.question_text,
            "faculty": self.question.faculty,
            "pen_name": self.question.user.user_name,
        }

    def test_response_successful_put(self):
        """Sucessful PUT request handling."""
        self.question_put_dict['question_text'] = 'Does monkey eat fish?'
        response = self.question_put.put_data(self.question_put_dict)
        self.assertEqual(json.loads(response.content)['success'], "The requested question's attribute has been changed.")
        self.assertEqual(response.status_code, 200)
        self.question = QA_Question.objects.get(question_id=self.question_put_dict['question_id'])
        self.assertEqual(self.question.question_text, self.question_put_dict['question_text'])

    def test_response_missing_data_attribute(self):
        """Missing an attribute in data body ('question_id')."""
        del self.question_put_dict['question_id']
        response = self.question_put.put_data(self.question_put_dict)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                         "Some crucial attributes are missing from the data.")
        
    def test_response_question_id_doesnt_exist(self):
        """Data provided question_id that doesn't exist."""
        self.question_put_dict['question_id'] = 9999
        self.question_put_dict['question_text'] = 'OOGABOOGA_BANANA'
        response = self.question_put.put_data(self.question_put_dict)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                            "The Question with that ID does not exists.")
        
    def test_response_anonymous(self):
        """Sucessful PUT request handling."""
        question_id = self.question_put_dict['question_id']
        self.question_put_dict['pen_name'] = 'Anonymous'
        response = self.question_put.put_data(self.question_put_dict)
        self.assertEqual(json.loads(response.content)['success'], "The requested question's attribute has been changed.")
        self.assertEqual(response.status_code, 200)
        question_anonymous = QA_Question.objects.get(question_id=question_id)
        self.assertEqual(question_anonymous.is_anonymous, True)


class AnswerPutTest(TestCase):
    """Testcases for PUT request to answer."""

    def setUp(self):
        """Set up for every test."""
        qa_setup()
        self.answer_put = QA_AnswerPut()
        self.answer = QA_Answer.objects.all()[0]
        self.answer_put_dict = {
            "answer_id": self.answer.answer_id,
            "answer_text": self.answer.answer_text,
            "pen_name": self.answer.user.user_name
        }

    def test_response_successful_put(self):
        """Sucessful PUT request handling."""
        self.answer_put_dict['answer_text'] = 'Monkey eat fish'
        response = self.answer_put.put_data(self.answer_put_dict)
        self.assertEqual(json.loads(response.content)['success'], "The requested answer's attribute has been changed.")
        self.assertEqual(response.status_code, 200)
        self.answer = QA_Answer.objects.get(answer_id=self.answer_put_dict['answer_id'])
        self.assertEqual(self.answer.answer_text, self.answer_put_dict['answer_text'])

    def test_response_missing_data_attribute(self):
        """Missing an attribute in data body ('answer_id')."""
        del self.answer_put_dict['answer_id']
        response = self.answer_put.put_data(self.answer_put_dict)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                         "Some crucial attributes are missing from the data.")
        
    def test_response_answer_id_doesnt_exist(self):
        """Data provided answer_id that doesn't exist."""
        self.answer_put_dict['answer_id'] = 9999
        self.answer_put_dict['answer_text'] = 'BANANA OBAMA'
        response = self.answer_put.put_data(self.answer_put_dict)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)["error"],
                            "The Answer with that ID does not exists.")
        
    def test_response_anonymous(self):
        """Sucessful PUT request handling."""
        answer_id = self.answer_put_dict['answer_id']
        self.answer_put_dict['pen_name'] = 'Anonymous'
        response = self.answer_put.put_data(self.answer_put_dict)
        self.assertEqual(json.loads(response.content)['success'], "The requested answer's attribute has been changed.")
        self.assertEqual(response.status_code, 200)
        answer_anonymous = QA_Answer.objects.get(answer_id=answer_id)
        self.assertEqual(answer_anonymous.is_anonymous, True)