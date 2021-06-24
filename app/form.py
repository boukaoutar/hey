from django.forms import ModelForm
from .models import Upload

#########
import cv2
import numpy as np
import pandas as pd

from shapely.geometry.polygon import Polygon
from shapely.geometry import Point

import imutils

class UploadForm(ModelForm):
    class Meta:
        model = Upload
        fields = ("name","pic")

