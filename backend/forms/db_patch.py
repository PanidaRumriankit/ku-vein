"""This module use for post and update database."""

import logging

from datetime import datetime
from abc import ABC, abstractmethod
from ninja.responses import Response
from .models import CourseReview, UserData, CourseData, ReviewStat

logger = logging.getLogger("user_logger")


class PatchStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def patch_data(self, data: dict):
        """Update the data to the database."""


class UserDataPatch(PatchStrategy):
    """Class for editing existing UserData object."""

    def patch_data(self, data: dict):
        """Add the data to the UserData."""
        try:
            user = UserData.objects.get(email=data['email'])
            user.user_name = data['user_name']
            user.save()

        except UserData.DoesNotExist:
            return Response({"error": "The User with that email does not exists."},
                            status=400)

        except KeyError:
            return Response({"error": "email or user_name is missing "
                             "from the data."},
                            status=400)


class ReviewPatch(PatchStrategy):
    """Class for editing existing CourseReview object."""

    def patch_data(self, data: dict):
        """Add the data to the CourseReview."""


class PatchFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPatch,
        "user": UserDataPatch
    }

    @classmethod
    def get_patch_strategy(cls, query: str) -> PatchStrategy:
        """
        Update the data based on the name of table.

        Args:
            query (str): The query parameter to choose the strategy.

        Returns:
            QueryStrategy: The corresponding query strategy class.

        Raises:
            ValueError: If the query stringdoesn't match any available
            strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        raise ValueError(f"Invalid post parameter: {query}")
