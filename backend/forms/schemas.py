from ninja import ModelSchema
from .models import CourseData, UserData, CourseReview
from .models import ReviewStat, Summary, QA, BookMark
from .models import Inter, Normal, Special


class CourseDataSchema(ModelSchema):
    class Meta:
        model = CourseData
        fields = '__all__'

class NormalSchema(ModelSchema):
    class Meta:
        model = Normal
        fields = '__all__'

class InterSchema(ModelSchema):
    class Meta:
        model = Inter
        fields = '__all__'

class SpecialSchema(ModelSchema):
    class Meta:
        model = Special
        fields = '__all__'


class UserDataSchema(ModelSchema):
    class Meta:
        model = UserData
        fields = '__all__'


class CourseReviewSchema(ModelSchema):
    class Meta:
        model = CourseReview
        fields = '__all__'


class ReviewStatSchema(ModelSchema):
    class Meta:
        model = ReviewStat
        fields = '__all__'


class SummarySchema(ModelSchema):
    class Meta:
        model = Summary
        fields = '__all__'


class QASchema(ModelSchema):
    class Meta:
        model = QA
        fields = '__all__'


class BookMarkSchema(ModelSchema):
    class Meta:
        model = BookMark
        fields = '__all__'
