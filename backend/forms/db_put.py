"""This module use for PUT and update database."""

import logging

from datetime import datetime
from abc import ABC, abstractmethod
from ninja.responses import Response
from .models import CourseReview, UserData, CourseData, ReviewStat

logger = logging.getLogger("user_logger")


class PutStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def put_data(self, data: dict):
        """Update the data to the database."""


class UserDataPut(PutStrategy):
    """Class for editing existing UserData object."""

    def put_data(self, data: dict):
        """Add the data to the UserData."""
        try:
            checkuser = UserData.objects.get(user_name=data['user_name'])
        except UserData.DoesNotExist:
            pass
        else:
            if checkuser.user_id != data['user_id']:
                return Response({'error': 'This username was taken.'}, status=400)
        
        try:
            user = UserData.objects.get(user_id=data['user_id'])

            if '_state' in data.keys():
                return Response({'error': 'The data contains prohibited fields.'}, status=400)

            # Attribute validation
            # Using set() because it is unordered but list is ordered.
            if set(user.__dict__.keys()) != set(data.keys()).union({'_state'}):
                raise ValueError 

            user_dict = user.__dict__
            for key, val in data.items():
                user_dict[key] = val
                logger.info(f"User_id: {user_dict['user_id']} -- Changed their attribute {key} to {val}.")

        except KeyError:
            return Response({"error": "user_id attribute is missing from the data."})

        except UserData.DoesNotExist:
            return Response({"error": "The User with that ID does not exists."},
                            status=400)

        except ValueError:
            return Response({"error": "Some attribute is missing from the data.",
                            "ex_attribute": ['user_id', 'user_name', 'user_type', 'email', 'description', 'profile_color']},
                            status=400)

        user.save()
        return Response({"success": "The requested user's attribute has been changed.",
                         "user_data": [{key: val} for key, val in user.__dict__.items() if key[0] != '_']
                         }, status=200)


class ReviewPut(PutStrategy):
    """Class for editing existing CourseReview object."""

    def put_data(self, data: dict):
        """Add the data to the CourseReview."""


class PutFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPut,
        "user": UserDataPut
    }

    @classmethod
    def get_put_strategy(cls, query: str) -> PutStrategy:
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
