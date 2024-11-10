"""This module use for contain the class for database query."""

from typing import Union
from abc import ABC, abstractmethod
from django.db.models import F, Count
from ninja.responses import Response
from .models import (Inter, ReviewStat, Special,
                     Normal, CourseData, UserData, FollowData,
                     QA_Question, QA_Answer)
from typing import Any


class QueryStrategy(ABC):
    """Abstract base class for make the query."""

    @abstractmethod
    def get_data(self):
        """Get the data from the database."""
        pass


class QueryFilterStrategy(ABC):
    """Abstract base class for make the query with condition."""

    @abstractmethod
    def get_data(self, *args: Any, **kwargs: Any) -> Any:
        """Get the data from the database."""
        pass


class SortReview(QueryFilterStrategy):
    """Class for sent CourseReview sorted by condition."""

    def __init__(self):
        """Initialize method for SortReview."""
        self.sorted_data = None
        self.order = {"earliest": "review__review_id",
                      "latest": "-review__review_id", "upvote": "-upvote"}

    def get_data(self, order_by: str, filter_by: str=None):
        """Get the sorted data from the database."""
        self.sort_by(self.order[order_by], filter_by)
        return list(self.sorted_data)

    def sort_by(self, condition: str, course_id: str=None) -> None:
        """Return the sorted data."""
        self.sorted_data = ReviewStat.objects.values(
            reviews_id=F('review__review_id'),
            courses_id=F('review__course__course_id'),
            courses_name=F('review__course__course_name'),
            faculties=F('review__course__faculty'),
            username=F('review__user__user_name'),
            review_text=F('review__reviews'),
            ratings=F('rating'),
            year=F('academic_year'),
            name=F('pen_name'),
            date=F('date_data'),
            grades=F('grade'),
            professor=F('review__instructor')
        ).annotate(
            upvote=Count('upvotestat')
        ).order_by(condition)

        if course_id:
            self.sorted_data = self.sorted_data.filter(courses_id=course_id)



class InterQuery(QueryStrategy):
    """Class for sent the Inter Table data."""

    def get_data(self):
        """Get the data from the database and return to the frontend."""
        inter_data = Inter.objects.select_related('course').values(
            courses_id=F('course__course_id'),
            courses_name=F('course__course_name'),
            faculties=F('course__faculty'),
            courses_type=F('course__course_type')
        )

        return list(inter_data)


class SpecialQuery(QueryStrategy):
    """Class for sent the Special Table data."""

    def get_data(self):
        """Get the data from the database and return to the frontend."""
        special_data = Special.objects.select_related('course').values(
            courses_id=F('course__course_id'),
            courses_name=F('course__course_name'),
            faculties=F('course__faculty'),
            courses_type=F('course__course_type')
        )

        return list(special_data)


class NormalQuery(QueryStrategy):
    """Class for sent the Normal Table data."""

    def get_data(self):
        """Get the data from the database and return to the frontend."""
        normal_data = Normal.objects.select_related('course').values(
            courses_id=F('course__course_id'),
            courses_name=F('course__course_name'),
            faculties=F('course__faculty'),
            courses_type=F('course__course_type')
        )

        return list(normal_data)


class CourseQuery(QueryStrategy):
    """Class for sent all the value in the course data."""

    def get_data(self):
        """Get the data from the database and return to the frontend."""
        course_data = CourseData.objects.select_related('course').values(
            courses_id=F('course_id'),
            courses_name=F('course_name'),
            faculties=F('faculty'),
            courses_type=F('course_type')
        )

        return list(course_data)


class UserQuery(QueryFilterStrategy):
    """Class for sent the value in the user data."""

    def __init__(self):
        self.user = None

    def get_data(self, filter_key: dict):
        """Get the data from the database and return to the frontend."""
        if filter_key['email']:
            self.user = UserData.objects.filter(email=filter_key['email']).values(
                id=F('user_id'),
                username=F('user_name'),
                desc=F('description'),
                pf_color=F('profile_color'),
            ).first()
        elif filter_key['user_id']:
            self.user = UserData.objects.filter(user_id=filter_key['user_id']).values(
                id=F('user_id'),
                username=F('user_name'),
                desc=F('description'),
                pf_color=F('profile_color'),
            ).first()
        try:
            self.user['following'] = []
            self.user['follower'] = []
        except (TypeError, KeyError):
            return Response({"error": "This user isn't in the database."},
                            status=401)

        if self.user:
            following = list(FollowData.objects.filter(follow_by=self.user['id']).values(
                username=F('this_user__user_name'),
                desc=F('this_user__description')
            ))

            follower = list(FollowData.objects.filter(this_user=self.user['id']).values(
                username=F('follow_by__user_name'),
                desc=F('follow_by__description')
            ))

            self.user['following'] = following
            self.user['follower'] = follower

        self.user['follower_count'] = len(self.user['follower'])
        self.user['following_count'] = len(self.user['following'])

        return self.user


class QuestionQuery(QueryStrategy):
    """Class for sending all the questions in the Q&A data."""

    def get_data(self, *args, **kwargs):
        """Get the data from the database and return to the frontend."""
        question_data = QA_Question.objects.select_related().values(
                    questions_id=F('question_id'),
                    questions_text=F('question_text'),
                    users=F('user')
        )

        return list(question_data)


class AnswerQuery(QueryFilterStrategy):
    """Class for sending all the answers for a question in the Q&A data."""

    def get_data(self, question_id):
        """Get the data from the database and return to the frontend."""
        try:
            question = QA_Question.objects.select_related().get(question_id=question_id)
            answer_set = question.qa_answer_set.all()
            answer_data = answer_set.values(
                text=F('answer_text')
            )
        except QA_Question.DoesNotExist:
            return Response({"error": "This question isn't in the database."}, status=400)

        return Response(list(answer_data), status=200)


class QueryFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "sort": SortReview,
        "inter": InterQuery,
        "special": SpecialQuery,
        "normal": NormalQuery,
        "none": CourseQuery,
        "user": UserQuery,
        "qa_question": QuestionQuery,
        "qa_answer": AnswerQuery,
        }

    @classmethod
    def get_query_strategy(cls, query: str)\
            -> Union[QueryStrategy, QueryFilterStrategy]:
        """
        Return the query strategy based on the query string.

        Args:
            query (str): The query parameter to choose the strategy.

        Returns:
            QueryStrategy: The corresponding query strategy class.

        Raises:
            ValueError: If the query string
            doesn't match any available strategies.
        """
        query_lower = query.lower()
        if query_lower in cls.strategy_map:
            return cls.strategy_map[query_lower]()
        raise ValueError(f"Invalid query parameter: {query}")
