"""Models module to collect data for User relate feature."""

from django.db import models


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
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, unique=True)
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