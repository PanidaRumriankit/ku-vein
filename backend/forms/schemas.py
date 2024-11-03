"""This module is for receive json data from the frontend to use in backend."""

from ninja import ModelSchema, Schema
from .models import CourseData, UserData, CourseReview
from .models import ReviewStat, Note, QA, BookMark
from .models import Inter, Normal, Special


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
    pen_name: str
    grade: str


class UpvotePostSchema(Schema):
    """Schema for increase the upvote number."""
    email: str
    course_id: str
    faculty: str
    course_type: str


class NoteSchema(ModelSchema):
    """
    Schema for Summary model, representing summaries written by users.

    Includes all fields in the Summary model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = Note
        fields = '__all__'


class QASchema(ModelSchema):
    """
    Schema for QA model, containing questions and answers related to courses.

    Includes all fields in the QA model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = QA
        fields = '__all__'


class BookMarkSchema(ModelSchema):
    """
    Schema for BookMark model, representing bookmarked courses by users.

    Includes all fields in the BookMark model.
    """

    class Meta:
        """Metaclass for linking this schema to the target model."""

        model = BookMark
        fields = '__all__'