# Generated by Django 5.1.2 on 2024-11-24 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0007_remove_note_note_file_note_pdf_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='pdf_url',
            field=models.CharField(default=None, max_length=1000),
        ),
    ]
