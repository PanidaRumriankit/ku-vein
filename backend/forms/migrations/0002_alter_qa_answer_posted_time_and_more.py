# Generated by Django 5.1.2 on 2024-11-25 06:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qa_answer',
            name='posted_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='qa_question',
            name='posted_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]