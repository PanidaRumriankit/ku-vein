"""Models module to collect data for Note feature."""

from django.db import models
from .course_data_model import CourseData
from .user_model import UserData

class Note(models.Model):
    note_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE,
                               related_name='summaries')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    date_data = models.DateTimeField(auto_now_add=True)
    faculty = models.CharField(max_length=100, default=None)
    file_name = models.CharField(max_length=255, default=None)
    pdf_url = models.CharField(max_length=1000, default=None)
    pen_name = models.CharField(max_length=100, default=None)
    anonymous = models.BooleanField(default=False)

    class Meta:
        app_label = 'forms'
        db_table = 'Note'
