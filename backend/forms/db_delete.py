"""This module use for contain the class for database delete."""

from abc import ABC, abstractmethod
from typing import Any

from ninja.responses import Response

from .models.note_model import Note
from .models.review_model import CourseReview
from .models.qa_model import QA_Question, QA_Answer

class DeleteStrategy(ABC):
    """Abstract base class for make the query with condition."""

    @abstractmethod
    def delete_data(self, *args: Any, **kwargs: Any) -> Any:
        """DELETE the data from the database."""
        pass


class CourseReviewDelete(DeleteStrategy):
    """Class for delete CourseReview objects."""

    def delete_data(self, data):
        """Delete CourseReview and ReviewStat objects"""
        try:
            delete_target = CourseReview.objects.get(review_id=data['review_id'])
            delete_target.delete()
            return Response({"success": "Delete"
                                        " Review Successfully."}, status=200)

        except CourseReview.DoesNotExist:
            return Response({"error": "This review"
                                      " isn't in the database."}, status=401)

class NoteDelete(DeleteStrategy):
    """Class for delete Note objects."""

    def delete_data(self, data):
        """Delete Note objects"""
        try:
            delete_target = Note.objects.get(note_id=data['note_id'])
            delete_target.delete()
            return Response({"success": "Delete"
                                        " Note Successfully."}, status=200)

        except Note.DoesNotExist:
            return Response({"error": "This Note"
                                      " isn't in the database."}, status=401)
        

class QuestionDelete(DeleteStrategy):
    """Class for delete Question objects."""

    def delete_data(self, data):
        """Delete Question objects."""
        try:
            question = QA_Question.objects.get(question_id=data['question_id'])
            question.delete()
            return Response({"success": "Delete Question Successfully."},
                            status=200)
        except QA_Question.DoesNotExist:
            return Response({"error": "This Question isn't in the database."},
                            status=401)
        

class AnswerDelete(DeleteStrategy):
    """Class for delete Answer objects."""

    def delete_data(self, data):
        """Delete Answer objects."""
        try:
            answer = QA_Answer.objects.get(answer_id=data['answer_id'])
            answer.delete()
            return Response({"success": "Delete Answer Successfully."},
                            status=200)
        except QA_Answer.DoesNotExist:
            return Response({"error": "This Answer isn't in the database."},
                            status=401)


class DeleteFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": CourseReviewDelete,
        "note": NoteDelete,
        "question": QuestionDelete,
        "answer": AnswerDelete,
    }

    @classmethod
    def get_delete_strategy(cls, query: str)\
            -> DeleteStrategy:
        """
        Return the query strategy based on the query string.

        Args:
            query (str): The query parameter to choose the strategy.

        Returns:
            DeleteStrategy: The corresponding delete strategy class.

        Raises:
            ValueError: If the query string
            doesn't match any available strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        raise ValueError(f"Invalid query parameter: {query}")