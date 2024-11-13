"""Models module for make query for the frontend."""

from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


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


class UserData(models.Model):
    user_id = models.AutoField(primary_key=True, unique=True)
    user_name = models.CharField(max_length=30, unique=True, default=None)
    user_type = models.CharField(max_length=20, default="student")
    email = models.TextField(default=None)
    description = models.TextField(default="")
    profile_color = models.CharField(max_length=7, default="#ffffff")

    class Meta:
        db_table = 'UserData'


class FollowData(models.Model):
    this_user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='following')
    follow_by = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        app_label = 'forms'
        db_table = 'FollowData'
        unique_together = ('this_user', 'follow_by')


class CourseReview(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE,
                               related_name='reviews')
    reviews = models.TextField(default=None)
    faculty = models.CharField(max_length=100, default=None)
    instructor = models.CharField(max_length=40, default=None, null=True)

    class Meta:
        app_label = 'forms'
        db_table = 'CourseReview'


class ReviewStat(models.Model):
    review = models.OneToOneField(CourseReview, on_delete=models.CASCADE,
                                  primary_key=True, default=None)
    rating = models.FloatField(default=0.0)
    academic_year = models.IntegerField(default=0)
    pen_name = models.CharField(max_length=100, default=None)
    date_data = models.DateTimeField(default=None)
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


class Note(models.Model):
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE,
                               related_name='summaries')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    date_data = models.DateTimeField(default=None)
    faculty = models.CharField(max_length=100, default=None)
    note_file = models.FileField(upload_to='note_files/', default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'Note'
        unique_together = ('course', 'user')


class QA(models.Model):
    question_id = models.AutoField(unique=True, primary_key=True)
    question_text = models.TextField(default=None)
    faculty = models.CharField(max_length=100, default=None)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)

    class Meta:
        app_label = 'forms'
        db_table = 'QA'


class Comment(models.Model):
    question = models.ForeignKey(QA, on_delete=models.CASCADE)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    comment = models.CharField(max_length=255, default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'Comment'
        unique_together = ('user', 'comment')


class BookMark(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, default=None)
    object_id = models.PositiveIntegerField(default=None)
    instance = GenericForeignKey('content_type', 'object_id')
    data_type = models.CharField(max_length=20, default=None)
    user = models.ForeignKey(UserData, on_delete=models.PROTECT)

    class Meta:
        app_label = 'forms'
        db_table = 'BookMark'
        unique_together = ('content_type', 'object_id', 'user')


class History(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, default=None)
    object_id = models.PositiveIntegerField(default=None)
    instance = GenericForeignKey('content_type', 'object_id')
    data_type = models.CharField(max_length=20, default=None)
    user = models.ForeignKey(UserData, on_delete=models.PROTECT)

    class Meta:
        app_label = 'forms'
        db_table = 'History'
        unique_together = ('content_type', 'object_id', 'user')
