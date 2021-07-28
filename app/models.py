from django.db import models
from datetime import datetime, date

# Create your models here.

class Upload(models.Model):
    name = models.CharField(null=True,max_length=25)
    pic = models.ImageField(null=True,upload_to="images/")

    def __str__(self):
        return self.name

class Labels(models.Model):
    label = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.label