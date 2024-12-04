"""Models module to collect data for Bookmark and History feature."""

from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from .user_model import UserData

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
