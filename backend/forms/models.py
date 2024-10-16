"""Models module for make query for the frontend."""

from django.db import models

class CourseData(models.Model):
    course_id = models.CharField(max_length=20, primary_key=True)
    faculty = models.CharField(max_length=100, primary_key=True)
    course_name = models.TextField()

    class Meta:
        db_table = 'CourseData'  # Specify the exact table name in MySQL

class ReviewStat(models.Model):
    review_id = models.AutoField(primary_key=True)
    course_id = models.ForeignKey(CourseData, on_delete=models.CASCADE)
    date_data = models.DateField()
    grade = models.CharField(max_length=1)
    upvotes = models.IntegerField()

    class Meta:
        db_table = 'ReviewStat'

class UserData(models.Model):
    user_id = models.AutoField(primary_key=True, unique=True)
    user_name = models.CharField(max_length=30, unique=True)
    user_type = models.CharField(max_length=20)
    email = models.TextField()

    class Meta:
        db_table = 'UserData'
