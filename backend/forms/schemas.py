"""This module is for receive json data from the frontend to use in backend."""

from typing import Optional

from ninja import ModelSchema, Schema

from .models import CourseData, UserData, CourseReview
<<<<<<< HEAD
from .models import ReviewStat, Note, BookMark
=======
>>>>>>> main
from .models import Inter, Normal, Special
from .models import ReviewStat, Note, QA


class CourseDataSchema(ModelSchema):
    """
    Schema for CourseData model, representing details about courses.

    Includes fields such as course ID, name, faculty, and course type.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = CourseData
        fields = '__all__'


class NormalSchema(ModelSchema):
    """
    Schema for Normal model, representing regular courses.

    Includes all fields in the Normal model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = Normal
        fields = '__all__'


class InterSchema(ModelSchema):
    """
    Schema for Inter model, representing international courses.

    Includes all fields in the Inter model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = Inter
        fields = '__all__'


class SpecialSchema(ModelSchema):
    """
    Schema for Special model, representing special courses.

    Includes all fields in the Special model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = Special
        fields = '__all__'


class UserDataSchema(ModelSchema):
    """
    Schema for creating new UserData entries with limited fields.

    Currently only includes the user's email field.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = UserData
        fields = ['email']


class UserDataEditSchema(ModelSchema):
    """
    Schema for editing existing user data.

    Take all the fields from the accounts edit forms.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = UserData
        fields = '__all__'

        
class FollowSchema(Schema):
    """Schema for follower feature."""
    current_user_id: str
    target_user_id: str


class CourseReviewSchema(ModelSchema):
    """
    Schema for CourseReview model, representing reviews left by users.

    Includes all fields in the CourseReview model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = CourseReview
        fields = '__all__'


class ReviewStatSchema(ModelSchema):
    """
    Schema for ReviewStat model.

    Containing statistical data for course reviews.
    Includes all fields in the ReviewStat model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = ReviewStat
        fields = '__all__'


class ReviewPostSchema(Schema):
    """
    Schema for handling incoming review requests from users.

    These fields are for CourseReview:
    - email (str): User's email address.
    - course_id (str): Unique identifier for the course.
    - course_type (str): Type of the course (e.g., Inter, Special, Normal).
    - faculty (str): Faculty to which the course belongs.
    - reviews (str): Text of the user’s review.

    These fields are for ReviewStats:
    - rating (float): User's rating for the course.
    - academic_year (int): Year associated with the review.
    - pen_name (str): User's preferred display name.
    - grade (str): Grade assigned to the course by the user.
    """
    email: str
    course_id: str
    course_type: str
    faculty: str
    reviews: str
    rating: float
    academic_year: int
    pen_name: Optional[str] = None
    grade: str
    instructor: str
    effort: int
    attendance: int
    scoring_criteria: str
    class_type: str


class UpvotePostSchema(Schema):
    """Schema for increase the upvote number."""
    email: str
    id: int


class NoteSchema(ModelSchema):
    """
    Schema for Summary model, representing summaries written by users.

    Includes all fields in the Summary model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = Note
        fields = '__all__'


class NotePostSchema(Schema):
    """
    Schema for handling POST requests to upload a note associated with a course and user.

    Attributes:
        email (str): The email address of the user uploading the note.
        course_id (str): The unique identifier of the course.
        faculty (str): The faculty name associated with the course.
        course_type (str): The type of course (e.g., 'Normal', 'Special').
        file (str): The file to be uploaded (should be a PDF file). The file is represented as a string
                      URL or base64-encoded data of the PDF file.

    Example:
        {
            "email": "user@example.com",
            "course_id": "123",
            "faculty": "Computer Science",
            "course_type": "Normal",
            "file": "base64-encoded-string"
        }
    """

    email : str
    course_id: str
    faculty: str
    course_type: str
    file : str
    file_name : str
    pen_name: Optional[str] = None


class QuestionCreateSchema(Schema):
    """
    Schema for QA_Question, used for creating new questions.

    Attributes:
        user_id (str): The user id of the question's creator.
        question_text (str): The texts of the question.

    Example:
        {
            "user_id": "1",
            "question_text": "Is Prof.Ichi a monkey?",
        }
    """

    user_id: str
    question_text: str


class AnswerCreateSchema(Schema):
    """
    Schema for QA_Answer, used for creating new answers to a question.

    Attributes:
        question_id (str): The question id of the answer.
        answer_text (str): The texts of the question.
        user_id (str): The user id of the user who answered the question.

    Example:
        {
            "question_id": "1"
            "answer_text": "Prof.Ichi is just a Congalala fan.",
            "user_id": "2"
        }
    """

    question_id: str
    answer_text: str
    user_id: str

class BookMarkSchema(Schema):
    """
    Schema for handling POST requests to add the bookmark.

      Attributes:
        email (str): The email address of the user uploading the note.
        id (int): id of the Review or Note or Q&A objects
        data_type (str): Type of this data (review, note, qa)

    Example:
        {
            "email": "user@example.com",
            "id": 15,
            "data_type": "qa",

        }
    """
    email : str
    id : int
    data_type : str