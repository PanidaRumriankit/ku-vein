import os
import sys
import django

from django.db.models import F
from backend.forms.models import CourseReview
from .schemas import CourseReviewSchema
from abc import ABC, abstractmethod

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()


class PostStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def post_data(self, data):
        """Update the data to the database."""
        pass

class ReviewPost(PostStrategy):
    """Class for created new CourseReview object."""

    def post_data(self, data):
        """Add the data to the CourseReview."""
        CourseReview.objects.create(**data)

class PostFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPost
    }

    @classmethod
    def get_post_strategy(cls, query: str) -> PostStrategy:
        """
        Update the data based on the name of table.

        Args:
            query (str): The query parameter to choose the strategy.

        Returns:
            QueryStrategy: The corresponding query strategy class.

        Raises:
            ValueError: If the query string doesn't match any available strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        else:
            raise ValueError(f"Invalid post parameter: {query}")