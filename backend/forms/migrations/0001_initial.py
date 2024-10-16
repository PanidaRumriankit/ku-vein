# Generated by Django 5.1.2 on 2024-10-16 13:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CourseReview',
            fields=[
                ('review_id', models.AutoField(primary_key=True, serialize=False)),
                ('reviews', models.TextField()),
            ],
            options={
                'db_table': 'CourseReview',
            },
        ),
        migrations.CreateModel(
            name='UserData',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('user_name', models.CharField(max_length=30, unique=True)),
                ('user_type', models.CharField(max_length=20)),
                ('email', models.TextField()),
            ],
            options={
                'db_table': 'UserData',
            },
        ),
        migrations.CreateModel(
            name='CourseData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_id', models.CharField(max_length=20)),
                ('faculty', models.CharField(max_length=100)),
                ('course_name', models.TextField()),
            ],
            options={
                'db_table': 'CourseData',
                'unique_together': {('course_id', 'faculty')},
            },
        ),
        migrations.CreateModel(
            name='ReviewStat',
            fields=[
                ('review_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='forms.coursereview')),
                ('date_data', models.DateField()),
                ('grade', models.CharField(max_length=2)),
                ('upvotes', models.IntegerField()),
            ],
            options={
                'db_table': 'ReviewStat',
            },
        ),
        migrations.AddField(
            model_name='coursereview',
            name='course_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='forms.coursedata'),
        ),
        migrations.AddField(
            model_name='coursereview',
            name='faculty',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='faculty_reviews', to='forms.coursedata'),
        ),
        migrations.CreateModel(
            name='QA',
            fields=[
                ('question_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('comment', models.TextField()),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'QA',
            },
        ),
        migrations.AddField(
            model_name='coursereview',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata'),
        ),
        migrations.CreateModel(
            name='Summary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sum_text', models.TextField()),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='summaries', to='forms.coursedata')),
                ('faculty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='faculty_summaries', to='forms.coursedata')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.userdata')),
            ],
            options={
                'db_table': 'Summary',
                'unique_together': {('course_id', 'user_id')},
            },
        ),
        migrations.CreateModel(
            name='BookMark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='forms.coursereview')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='forms.userdata')),
            ],
            options={
                'db_table': 'BookMark',
                'unique_together': {('review_id', 'user_id')},
            },
        ),
    ]