# Generated by Django 5.0.6 on 2024-06-04 11:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('flashcards', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='LearningSessionCompletedEvent',
        ),
    ]
