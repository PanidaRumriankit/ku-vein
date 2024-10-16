from ninja import ModelSchema
from .models import CourseData

class CourseDataSchema(ModelSchema):
    class Meta:
        model = CourseData
        fields = ('course_id', 'faculty', 'course_type', 'course_name')