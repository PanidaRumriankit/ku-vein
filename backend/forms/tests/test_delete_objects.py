import json

from django.test import TestCase

from .set_up import course_set_up, review_set_up, user_set_up, note_setup, \
    qa_setup
from ..db_delete import CourseReviewDelete, NoteDelete, QuestionDelete, \
    AnswerDelete
from ..models import CourseReview, ReviewStat, Note, QA_Question, QA_Answer


class CourseReviewDeleteTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        course_set_up()
        self.user = user_set_up()
        self.review, self.data = review_set_up()
        self.delete = CourseReviewDelete()

    def test_response_review_not_in_database(self):
        """If review isn't in database it should return 401."""
        response = self.delete.delete_data({"review_id": 69})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This review"
                                   " isn't in the database."})

    def test_response_delete_success(self):
        """If delete successfully it should return 200."""
        response = self.delete.delete_data(
             {"review_id":  CourseReview.objects.first().review_id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content),
                         {"success": "Delete"
                                     " Review Successfully."})

    def test_delete_objects(self):
        """Data should not exists after delete."""
        review_id = CourseReview.objects.first().review_id

        review = CourseReview.objects.get(review_id=review_id)
        self.assertIsNotNone(review)
        self.assertIsNotNone(ReviewStat.objects.get(review=review))

        self.delete.delete_data({"review_id": review_id})
        with self.assertRaises(CourseReview.DoesNotExist):
            CourseReview.objects.get(review_id=review_id)

        with self.assertRaises(ReviewStat.DoesNotExist):
            ReviewStat.objects.get(review_id=review_id)


class NoteDeleteTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.course, self.course_data = course_set_up()
        self.user = user_set_up()
        note_setup(self.course, self.user)
        self.delete = NoteDelete()

    def test_response_note_not_in_database(self):
        """If Note isn't in database it should return 401."""
        response = self.delete.delete_data({"note_id": 69})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This Note"
                                   " isn't in the database."})

    def test_response_delete_success(self):
        """If delete successfully it should return 200."""
        response = self.delete.delete_data(
            {"note_id": Note.objects.first().note_id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content),
                         {"success": "Delete"
                                     " Note Successfully."})

    def test_delete_objects(self):
        """Data should not exists after delete."""
        note_id = Note.objects.first().note_id
        self.assertIsNotNone(Note.objects.get(note_id=note_id))
        self.delete.delete_data({"note_id": note_id})
        with self.assertRaises(Note.DoesNotExist):
            Note.objects.get(note_id=note_id)


class QuestionDeleteTests(TestCase):
    """Test cases for deleting Question."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.question, self.answer = qa_setup()
        self.delete = QuestionDelete()

    def test_response_delete_success(self):
        """If delete successfully it should return 200."""
        response = self.delete.delete_data(
            {"question_id": QA_Question.objects.first().question_id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content),
                         {"success": "Delete Question Successfully."})

    def test_response_question_not_in_database(self):
        """If question isn't in database it should return 401."""
        response = self.delete.delete_data({"question_id": 69})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This Question isn't in the database."})

    def test_delete_objects(self):
        """Data should not exists after delete."""
        question_id = QA_Question.objects.first().question_id
        self.assertIsNotNone(QA_Question.objects.get(question_id=question_id))
        self.delete.delete_data({"question_id": question_id})
        with self.assertRaises(QA_Question.DoesNotExist):
            QA_Question.objects.get(question_id=question_id)


class AnswerDeleteTests(TestCase):
    """Test cases for deleting Answer."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.question, self.answer = qa_setup()
        self.delete = AnswerDelete()

    def test_response_delete_success(self):
        """If delete successfully it should return 200."""
        response = self.delete.delete_data(
            {"answer_id": QA_Answer.objects.first().answer_id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content),
                         {"success": "Delete Answer Successfully."})

    def test_response_question_not_in_database(self):
        """If answer isn't in database it should return 401."""
        response = self.delete.delete_data({"answer_id": 69})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"error": "This Answer isn't in the database."})

    def test_delete_objects(self):
        """Data should not exists after delete."""
        answer_id = QA_Answer.objects.first().answer_id
        self.assertIsNotNone(QA_Answer.objects.get(answer_id=answer_id))
        self.delete.delete_data({"answer_id": answer_id})
        with self.assertRaises(QA_Answer.DoesNotExist):
            QA_Answer.objects.get(answer_id=answer_id)
