# Generated by Django 5.1.2 on 2024-10-16 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursedata',
            name='course_type',
            field=models.CharField(default=None, max_length=20),
            preserve_default=False,
        ),
    ]