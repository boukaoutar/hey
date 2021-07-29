from django.db import models
from datetime import datetime, date
from jsonfield import JSONField
# Create your models here.

class Upload(models.Model):
    name = models.CharField(null=True,max_length=25)
    pic = models.ImageField(null=True,upload_to="images/")
    json_data = json_data = JSONField(
        null=True,
        default=[{"pos": {"x": 696, "y": 235, "width": 105, "height": 160}, "type": "anatomy", "subtype": 38},
                 {"pos": {"x": 727, "y": 339, "width": 130, "height": 185}, "type": "anatomy", "subtype": 38},
                 {"pos": {"x": 825, "y": 353, "width": 102, "height": 208}, "type": "treatment", "subtype": 30}])

    def __str__(self):
        return self.name

class Category(models.Model):
    """
    This object represents a of detection with the informations:
    - type: Treatment, Disease or Anatomy depending on what is detected
    - key: for an image, it is the nth object of type
    - translations: informations formated to JSON
    - position_type: Tooth, General or None, dentist stuff
    - show_on_report: True (default) if the detection should be on the report, else False
    - show_on_image: True (default) if the detection should be on the image, else False
    - show_julie: True (default)
    """
    TYPES = (
        ('TREATMENT', 'Treatment'),
        ('DISEASE', 'Disease'),
        ('ANATOMY', 'Anatomy')
    )
    POSITION_TYPE = (
        ('TOOTH', 'Tooth'),
        ('GENERAL', 'General'),
        ("NONE", 'None')
    )
    type = models.CharField(max_length=24, choices=TYPES)
    key = models.IntegerField(null=False, blank=False)
    translations = JSONField(default=dict)
    position_type = models.CharField(max_length=16, choices=POSITION_TYPE, default='NONE')
    show_on_report = models.BooleanField(default=True)
    show_on_image = models.BooleanField(default=True)
    show_julie = models.BooleanField(default=True)
   
    def __str__(self):
        return f'{self.type} {self.key}: {self.translations}'
