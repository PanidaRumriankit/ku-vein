"""This module use for contain the class for database delete."""

from abc import ABC, abstractmethod
from typing import Any, Union

from ninja.responses import Response
from .models import (ReviewStat, Note,
                     CourseReview)


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


class DeleteFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": CourseReviewDelete,
        "note": NoteDelete,
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