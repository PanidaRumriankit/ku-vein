"""This module use for PUT and update database."""

import logging

from datetime import datetime
from abc import ABC, abstractmethod
from ninja.responses import Response
from .models import (CourseReview, UserData, CourseData, ReviewStat,
                     QA_Question, QA_Answer, Note)

logger = logging.getLogger("user_logger")


class PutStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def put_data(self, data: dict):
        """Update the data to the database."""


class UserDataPut(PutStrategy):
    """Class for editing existing UserData object."""

    def put_data(self, data: dict):
        """Change the data in the UserData."""
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
            if set(user.__dict__.keys()) != set(data.keys()).union({'email','_state'}):
                raise ValueError 

            user_dict = user.__dict__
            for key, val in data.items():
                user_dict[key] = val
                logger.info(f"User_id: {user.user_id} -- Changed their attribute {key} to {val}.")

            self.change_pen_name_to_new_name(user)

        except KeyError:
            return Response({"error": "user_id attribute is missing from the data."}, status=400)

        except UserData.DoesNotExist:
            return Response({"error": "The User with that ID does not exists."},
                            status=400)

        except ValueError:
            return Response({"error": "Some attribute is missing from the data.",
                            "ex_attribute": ['user_id', 'user_name', 'user_type', 'description', 'profile_color']},
                            status=400)

        user.save()
        return Response({"success": "The requested user's attribute has been changed.",
                         "user_data": [{key: val} for key, val in user.__dict__.items() if key[0] != '_']
                         }, status=200)
    
    def change_pen_name_to_new_name(self, user: UserData):
        all_note = Note.objects.filter(user=user)
        all_review = CourseReview.objects.filter(user=user)
        all_question = QA_Question.objects.filter(user=user)
        all_answer = QA_Answer.objects.filter(user=user)

        def update_pen_name(obj_list: list, check_attr: str, set_to: str):
            for obj in obj_list:
                if not getattr(obj, check_attr): # Check if the Q&A/Review/Note is anonymous
                    obj.__dict__['pen_name'] = set_to
                    logger.info(f"Obj {type(obj)}: Changed its attribute pen_name to {set_to}.")
                    obj.save()

        update_pen_name(all_note, 'anonymous', user.user_name)
        update_pen_name(all_question, 'is_anonymous', user.user_name)
        update_pen_name(all_answer, 'is_anonymous', user.user_name)
        for review in all_review:
            if not review.anonymous:
                review_stat = ReviewStat.objects.get(review=review)
                review_stat.pen_name = user.user_name
                review_stat.save()


class ReviewPut(PutStrategy):
    """Class for editing existing CourseReview object."""

    def put_data(self, data: dict):
        """Change the data in the UserData."""

        try:
            review = CourseReview.objects.get(review_id=data['review_id'])
            review_dict = review.__dict__

            review_dict['is_anonymous'] = (review.user.user_name != data['pen_name'])

            for key, val in data.items():
                review_dict[key] = val
                logger.info(f"Review_id: {review.review_id} -- Changed their attribute {key} to {val}.")

        except KeyError:
            return Response({"error": "Some crucial attributes are missing from the data."}, status=400)
        
        except CourseReview.DoesNotExist:
            return Response({"error": "The Review with that ID does not exists."}, status=400)

        review.save()
        return Response({"success": "The requested user's attribute has been changed.",
                         "review_data": [{key: val} for key, val in review.__dict__.items() if key[0] != '_']
                         }, status=200)


class NotePut(PutStrategy):
    """Class for editing existing Note objects."""

    def put_data(self, data: dict):
        """Change the data in the Note."""
        try:
            note = Note.objects.get(note_id=data['note_id'])
            note_dict = note.__dict__

            note_dict['anonymous'] = (note.user.user_name != data['pen_name'])

            for key, val in data.items():
                note_dict[key] = val
                logger.info(f"Note_id: {note.note_id} -- Changed their attribute {key} to {val}.")

        except KeyError:
            return Response({"error": "Some crucial attributes are missing from the data."}, status=400)
        
        except Note.DoesNotExist:
            return Response({"error": "The Note with that ID does not exists."}, status=400)

        note.save()
        return Response({"success": "The requested note's attribute has been changed.",
                         "note_data": [{key: val} for key, val in note.__dict__.items() if key not in ['note_file','_state']]
                         }, status=200)


class QA_QuestionPut(PutStrategy):
    """Class for editing existing QA objects."""

    def put_data(self, data: dict):
        """Change the data in the QA_Question."""
        try:
            question = QA_Question.objects.get(question_id=data['question_id'])
            question_dict = question.__dict__

            question_dict['is_anonymous'] = (question.user.user_name != data['pen_name'])

            for key, val in data.items():
                question_dict[key] = val
                logger.info(f"Question_id: {question.question_id} -- Changed their attribute {key} to {val}.")

        except KeyError:
            return Response({"error": "Some crucial attributes are missing from the data."}, status=400)
        
        except QA_Question.DoesNotExist:
            return Response({"error": "The Question with that ID does not exists."}, status=400)

        question.save()
        return Response({"success": "The requested question's attribute has been changed.",
                         "question_data": [{key: val} for key, val in question.__dict__.items() if key[0] != '_']
                         }, status=200)


class QA_AnswerPut(PutStrategy):
    """Class for editing existing QA objects."""

    def put_data(self, data: dict):
        """Change the data in the QA_Answer."""

        try:
            answer = QA_Answer.objects.get(answer_id=data['answer_id'])
            answer_dict = answer.__dict__
            answer_dict['is_anonymous'] = (answer.user.user_name != data['pen_name'])
            for key, val in data.items():
                answer_dict[key] = val
                logger.info(f"Answer_id: {answer.answer_id} -- Changed their attribute {key} to {val}.")


        except KeyError:
            return Response({"error": "Some crucial attributes are missing from the data."}, status=400)

        except QA_Answer.DoesNotExist:
            return Response({"error": "The Answer with that ID does not exists."}, status=400)

        answer.save()
        return Response({"success": "The requested answer's attribute has been changed.",
                         "answer_data": [{key: val} for key, val in answer.__dict__.items() if key[0] != '_']
                         }, status=200)


class PutFactory:
    """Factory class to handle query strategy selection."""

    strategy_map = {
        "review": ReviewPut,
        "user": UserDataPut,
        "question": QA_QuestionPut,
        "answer": QA_AnswerPut,
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
