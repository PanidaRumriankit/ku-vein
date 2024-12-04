"""Models module to collect data for Q&A feature."""

from django.db import models
from .course_data_model import CourseData
from .user_model import UserData


class QA_Question(models.Model):
    question_id = models.AutoField(unique=True, primary_key=True)
    question_title = models.CharField(max_length=100, default='')
    question_text = models.TextField(default=None)
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE)
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
