# Generated by Django 5.1.2 on 2024-11-20 16:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseReview',
            fields=[
                ('review_id', models.AutoField(primary_key=True, serialize=False)),
                ('reviews', models.TextField(default=None)),
                ('faculty', models.CharField(default=None, max_length=100)),
                ('instructor', models.CharField(default=None, max_length=40, null=True)),
            ],
            options={
                'db_table': 'CourseReview',
            },
        ),
        migrations.CreateModel(
            name='QA_Question',
            fields=[
                ('question_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('question_text', models.TextField(default=None)),
                ('faculty', models.CharField(default=None, max_length=100)),
                ('posted_time', models.DateTimeField(auto_now_add=True)),
                ('is_anonymous', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'QAQuestion',
            },
        ),
        migrations.CreateModel(
            name='UserData',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('user_name', models.CharField(default=None, max_length=30, unique=True)),
                ('user_type', models.CharField(default='student', max_length=20)),
                ('email', models.TextField(default=None)),
                ('description', models.TextField(default='')),
                ('profile_color', models.CharField(default='#ffffff', max_length=7)),
            ],
            options={
                'db_table': 'UserData',
            },
        ),
        migrations.CreateModel(
            name='CourseData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_id', models.CharField(default=None, max_length=20)),
                ('course_type', models.CharField(default=None, max_length=20)),
                ('course_name', models.TextField(default=None)),
            ],
            options={
                'db_table': 'CourseData',
                'unique_together': {('course_id', 'course_type')},
            },
        ),
        migrations.CreateModel(
            name='ReviewStat',
            fields=[
                ('review', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='forms.coursereview')),
                ('rating', models.FloatField(default=0.0)),
                ('academic_year', models.IntegerField(default=0)),
                ('pen_name', models.CharField(default=None, max_length=100)),
                ('date_data', models.DateTimeField(default=None)),
                ('grade', models.CharField(default=None, max_length=2)),
                ('effort', models.IntegerField(default=None)),
                ('attendance', models.IntegerField(default=None)),
                ('scoring_criteria', models.CharField(default=None, max_length=20)),
                ('class_type', models.CharField(default=None, max_length=20)),
            ],
            options={
                'db_table': 'ReviewStat',
            },
        ),
        migrations.AddField(
            model_name='coursereview',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='forms.coursedata'),
        ),
        migrations.CreateModel(
            name='Inter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='inter_courses', to='forms.coursedata')),
            ],
            options={
                'db_table': 'Inter',
            },
        ),
        migrations.CreateModel(
            name='Normal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='normal_courses', to='forms.coursedata')),
            ],
            options={
                'db_table': 'Normal',
            },
        ),
        migrations.CreateModel(
            name='QA_Answer',
            fields=[
                ('answer_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('answer_text', models.CharField(default=None, max_length=255)),
                ('posted_time', models.DateTimeField(auto_now_add=True)),
                ('is_anonymous', models.BooleanField(default=False)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.qa_question')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'QAAnswer',
            },
        ),
        migrations.CreateModel(
            name='Special',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='special_courses', to='forms.coursedata')),
            ],
            options={
                'db_table': 'Special',
            },
        ),
        migrations.AddField(
            model_name='qa_question',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata'),
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('note_id', models.AutoField(primary_key=True, serialize=False)),
                ('date_data', models.DateTimeField(default=None)),
                ('faculty', models.CharField(default=None, max_length=100)),
                ('file_name', models.CharField(default=None, max_length=255)),
                ('note_file', models.FileField(default=None, max_length=255, upload_to='note_files/')),
                ('pen_name', models.CharField(default=None, max_length=100)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='summaries', to='forms.coursedata')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'Note',
            },
        ),
        migrations.AddField(
            model_name='coursereview',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata'),
        ),
        migrations.CreateModel(
            name='QA_Question_Upvote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.qa_question')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'QAQuestionUpvote',
                'unique_together': {('question', 'user')},
            },
        ),
        migrations.CreateModel(
            name='QA_Answer_Upvote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.qa_answer')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'QAAnswerUpvote',
                'unique_together': {('answer', 'user')},
            },
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField(default=None)),
                ('data_type', models.CharField(default=None, max_length=20)),
                ('anonymous', models.BooleanField(default=False)),
                ('content_type', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'History',
                'unique_together': {('content_type', 'object_id', 'user')},
            },
        ),
        migrations.CreateModel(
            name='FollowData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follow_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followers', to='forms.userdata')),
                ('this_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to='forms.userdata')),
            ],
            options={
                'db_table': 'FollowData',
                'unique_together': {('this_user', 'follow_by')},
            },
        ),
        migrations.CreateModel(
            name='BookMark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField(default=None)),
                ('data_type', models.CharField(default=None, max_length=20)),
                ('content_type', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'BookMark',
                'unique_together': {('content_type', 'object_id', 'user')},
            },
        ),
        migrations.CreateModel(
            name='UpvoteStat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
                ('review_stat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.reviewstat')),
            ],
            options={
                'db_table': 'UpvoteStat',
                'unique_together': {('review_stat', 'user')},
            },
        ),
    ]
