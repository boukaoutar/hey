from django.http import HttpResponse
from django.shortcuts import render,redirect
from .form import UploadForm
from .models import Upload


# Create your views here.
def home(request):
    if request.method == "POST":
        form = UploadForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            form.save()
            obj = form.instance
            return render(request, "home.html", {"obj": obj})
    else:
        form = UploadForm()
    img = Upload.objects.all()
    return render(request, "home.html", {"img": img, "form": form})





