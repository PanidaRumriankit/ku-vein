"""Models module to collect data for Review relate feature."""

from django.db import models
from .user_model import UserData
from .course_data_model import CourseData

class CourseReview(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE,
                               related_name='reviews')
    reviews = models.TextField(default=None)
    faculty = models.CharField(max_length=100, default=None)
    instructor = models.CharField(max_length=40, default=None, null=True)
    anonymous = models.BooleanField(default=False)

    class Meta:
        app_label = 'forms'
        db_table = 'CourseReview'


class ReviewStat(models.Model):
    review = models.OneToOneField(CourseReview, on_delete=models.CASCADE,
                                  primary_key=True, default=None)
    rating = models.FloatField(default=0.0)
    academic_year = models.IntegerField(default=0)
    pen_name = models.CharField(max_length=100, default=None)
    date_data = models.DateTimeField(auto_now_add=True)
    grade = models.CharField(max_length=2, default=None)
    effort = models.IntegerField(default=None)
    attendance = models.IntegerField(default=None)
    scoring_criteria = models.CharField(max_length=20, default=None)
    class_type = models.CharField(max_length=20, default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'ReviewStat'


class UpvoteStat(models.Model):
    review_stat = models.ForeignKey(ReviewStat, on_delete=models.CASCADE)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)

    class Meta:
        app_label = 'forms'
        db_table = 'UpvoteStat'
        unique_together = ('review_stat', 'user')
