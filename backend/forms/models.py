"""Models module for make query for the frontend."""

from django.db import models


class CourseData(models.Model):
    course_id = models.CharField(max_length=20)
    faculty = models.CharField(max_length=100)
    course_type = models.CharField(max_length=20)
    course_name = models.TextField()

    class Meta:
        db_table = 'CourseData'  # Specify the exact table name in MySQL
        unique_together = ('course_id', 'faculty')

class Inter(models.Model):
    course = models.OneToOneField(CourseData, on_delete=models.CASCADE,
                                  related_name='inter_courses',
                                  default=None)

    class Meta:
        db_table = 'Inter'


class Special(models.Model):
    course = models.OneToOneField(CourseData, on_delete=models.CASCADE,
                                  related_name='special_courses',
                                  default=None)

    class Meta:
        db_table = 'Special'


class Normal(models.Model):
    course = models.OneToOneField(CourseData, on_delete=models.CASCADE,
                                  related_name='normal_courses',
                                  default=None)

    class Meta:
        db_table = 'Normal'


class UserData(models.Model):
    user_id = models.AutoField(primary_key=True, unique=True)
    user_name = models.CharField(max_length=30, unique=True)
    user_type = models.CharField(max_length=20)
    email = models.TextField()

    class Meta:
        db_table = 'UserData'


class CourseReview(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE, related_name='reviews')
    reviews = models.TextField()

    class Meta:
        db_table = 'CourseReview'


class ReviewStat(models.Model):

    review = models.OneToOneField(CourseReview, on_delete=models.CASCADE, primary_key=True)
    date_data = models.DateField()
    grade = models.CharField(max_length=2)
    upvotes = models.IntegerField()

    class Meta:
        db_table = 'ReviewStat'


class Summary(models.Model):
    course = models.ForeignKey(CourseData, on_delete=models.CASCADE,
                               related_name='summaries')

    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    sum_text = models.TextField()

    class Meta:
        db_table = 'Summary'
        unique_together = ('course', 'user')


class QA(models.Model):
    question_id = models.AutoField(unique=True, primary_key=True)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    comment = models.TextField()

    class Meta:
        db_table = 'QA'


class BookMark(models.Model):
    review = models.ForeignKey(CourseReview, on_delete=models.CASCADE)
    user = models.ForeignKey(UserData, on_delete=models.PROTECT)

    class Meta:
        db_table = 'BookMark'
        unique_together = ('review', 'user')
