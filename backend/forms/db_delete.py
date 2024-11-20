"""This module use for contain the class for database delete."""

from abc import ABC, abstractmethod
from typing import Any
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

    def delete_data(self, review_id):
        """Delete CourseReview and ReviewStat objects"""
        delete_target = CourseReview.objects.get(review_id=review_id)
        delete_target.delete()