from django.db import models


class Flashcard(models.Model):
    front = models.CharField(max_length=1000)
    back = models.CharField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
