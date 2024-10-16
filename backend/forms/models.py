"""Models module for make query for the frontend."""

from django.db import models

class CourseData(models.Model):
    course_id = models.CharField(max_length=20)
    faculty = models.CharField(max_length=100)
    course_name = models.TextField()

    class Meta:
        db_table = 'CourseData'  # Specify the exact table name in MySQL
        unique_together = ('course_id', 'faculty')  # Enforce uniqueness

class UserData(models.Model):
    user_id = models.AutoField(primary_key=True, unique=True)
    user_name = models.CharField(max_length=30, unique=True)
    user_type = models.CharField(max_length=20)
    email = models.TextField()

    class Meta:
        db_table = 'UserData'

class CourseReview(models.Model):
    review_id = models.AutoField(unique=True)
    user_id = models.ForeignKey(UserData, on_delete=models.CASCADE)
    course_id = models.ForeignKey(CourseData, on_delete=models.CASCADE)
    faculty = models.ForeignKey(CourseData, on_delete=models.CASCADE)
    reviews = models.TextField()

    class Meta:
        db_table = 'CourseReview'
        unique_together = ('user_id', 'course_id')  # Enforce uniqueness

class ReviewStat(models.Model):
    review_id = models.ForeignKey(CourseReview, on_delete=models.CASCADE, primary_key=True)  # Set review_id as FK
    date_data = models.DateField()
    grade = models.CharField(max_length=2)
    upvotes = models.IntegerField()

    class Meta:
        db_table = 'ReviewStat'

class Summary(models.Model):
    course_id = models.ForeignKey(CourseData, on_delete=models.CASCADE)
    user_id = models.ForeignKey(UserData, on_delete=models.CASCADE)
    sum_text = models.TextField()
    faculty = models.ForeignKey(CourseData, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Summary'
        unique_together = ('course_id', 'user_id')  # Enforce uniqueness

class QA(models.Model):
    question_id = models.AutoField(unique=True)
    user_id = models.ForeignKey(UserData, on_delete=models.CASCADE)
    comment = models.TextField()

    class Meta:
        db_table = 'QA'
        unique_together = ('question_id', 'user_id')  # Enforce uniqueness

class BookMark(models.Model):
    review_id = models.ForeignKey(CourseReview, on_delete=models.CASCADE)
    user_id = models.ForeignKey(UserData, on_delete=models.PROTECT)

    class Meta:
        db_table = 'BookMark'
        unique_together = ('review_id', 'user_id')  # Enforce uniqueness
