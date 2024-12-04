"""Models module for make query for the frontend."""

from django.db import models


class CourseData(models.Model):
    course_id = models.CharField(max_length=20, default=None)
    course_type = models.CharField(max_length=20, default=None)
    course_name = models.TextField(default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'CourseData'  # Specify the exact table name in MySQL
        unique_together = ('course_id', 'course_type')


class Inter(models.Model):
    course = models.OneToOneField(CourseData, on_delete=models.CASCADE,
                                  related_name='inter_courses',
                                  default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'Inter'


class Special(models.Model):
    course = models.OneToOneField(CourseData, on_delete=models.CASCADE,
                                  related_name='special_courses',
                                  default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'Special'


class Normal(models.Model):
    course = models.OneToOneField(CourseData, on_delete=models.CASCADE,
                                  related_name='normal_courses',
                                  default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'Normal'
