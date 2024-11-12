# Generated by Django 5.1.2 on 2024-11-12 09:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0010_qa_answer_posted_time_qa_question_posted_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='QA_Answer_Upvote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.qa_answer')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'QAAnswerUpvote',
                'unique_together': {('qa', 'user')},
            },
        ),
        migrations.CreateModel(
            name='QA_Question_Upvote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.qa_question')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'QAQuestionUpvote',
                'unique_together': {('qa', 'user')},
            },
        ),
    ]
