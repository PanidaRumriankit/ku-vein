from ninja import ModelSchema
from .models import CourseData, UserData, CourseReview
from .models import ReviewStat, Summary, QA, BookMark


class CourseDataSchema(ModelSchema):
    class Meta:
        model = CourseData
        fields = ('course_id', 'faculty', 'course_type', 'course_name')


class UserDataSchema(ModelSchema):
    class Meta:
        model = UserData
        fields = ('user_id', 'user_name', 'user_type', 'email')


class CourseReviewSchema(ModelSchema):
    class Meta:
        model = CourseReview
        fields = ('review_id', 'user_id', 'course_id', 'faculty', 'reviews')


class ReviewStatSchema(ModelSchema):
    class Meta:
        model = ReviewStat
        fields = ('review_id', 'date_data', 'grade', 'upvotes')


class SummarySchema(ModelSchema):
    class Meta:
        model = Summary
        fields = ('course_id', 'user_id', 'sum_text', 'faculty')


class QASchema(ModelSchema):
    class Meta:
        model = QA
        fields = ('question_id', 'user_id', 'comment')


class BookMarkSchema(ModelSchema):
    class Meta:
        model = BookMark
        fields = ('review_id', 'user_id')
