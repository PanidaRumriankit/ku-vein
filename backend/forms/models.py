"""Models module for make query for the frontend."""

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
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


class UserData(models.Model):
    user_id = models.AutoField(primary_key=True, unique=True)
    user_name = models.CharField(max_length=30, unique=True, default=None)
    user_type = models.CharField(max_length=20, default="student")
    email = models.TextField(default=None)
    description = models.TextField(default="")
    profile_color = models.CharField(max_length=7, default="#ffffff")

    class Meta:
        app_label = 'forms'
        db_table = 'UserData'


class UserProfile(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, primary_key=True)
    img_id = models.CharField(max_length=100, null=True, default=None)
    img_link = models.TextField(null=True, default=None)
    img_delete_hash = models.CharField(max_length=100, null=True, default=None)

    class Meta:
        app_label = 'forms'
        db_table = 'UserProfile'


class FollowData(models.Model):
    this_user = models.ForeignKey(UserData, on_delete=models.CASCADE,
                                  related_name='following')
    follow_by = models.ForeignKey(UserData, on_delete=models.CASCADE,
                                  related_name='followers')

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


class QA_Question(models.Model):
    question_id = models.AutoField(unique=True, primary_key=True)
    question_text = models.TextField(default=None)
    faculty = models.CharField(max_length=100, default=None)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    posted_time = models.DateTimeField(auto_now_add=True)
    pen_name = models.CharField(max_length=100, default=None)
    is_anonymous = models.BooleanField(default=False)

    class Meta:
        app_label = 'forms'
        db_table = 'QAQuestion'


class QA_Question_Upvote(models.Model):
    question = models.ForeignKey(QA_Question, on_delete=models.CASCADE)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)

    class Meta:
        app_label = 'forms'
        db_table = 'QAQuestionUpvote'
        unique_together = ('question', 'user')


class QA_Answer(models.Model):
    answer_id = models.AutoField(unique=True, primary_key=True)
    question = models.ForeignKey(QA_Question, on_delete=models.CASCADE)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=255, default=None)
    posted_time = models.DateTimeField(auto_now_add=True)
    pen_name = models.CharField(max_length=100, default=None)
    is_anonymous = models.BooleanField(default=False)

    class Meta:
        app_label = 'forms'
        db_table = 'QAAnswer'


class QA_Answer_Upvote(models.Model):
    answer = models.ForeignKey(QA_Answer, on_delete=models.CASCADE)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)

    class Meta:
        app_label = 'forms'
        db_table = 'QAAnswerUpvote'
        unique_together = ('answer', 'user')


class BookMark(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                                     default=None)
    object_id = models.PositiveIntegerField(default=None)
    instance = GenericForeignKey('content_type', 'object_id')
    data_type = models.CharField(max_length=20, default=None)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)

    class Meta:
        app_label = 'forms'
        db_table = 'BookMark'
        unique_together = ('content_type', 'object_id', 'user')


class History(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                                     default=None)
    object_id = models.PositiveIntegerField(default=None)
    instance = GenericForeignKey('content_type', 'object_id')
    data_type = models.CharField(max_length=20, default=None)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    anonymous = models.BooleanField(default=False)

    class Meta:
        app_label = 'forms'
        db_table = 'History'
        unique_together = ('content_type', 'object_id', 'user')
