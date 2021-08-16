from django.http import HttpResponse
from django.shortcuts import render, redirect
from .form import UploadForm
from .models import Upload, Category

# Create your views here.
# Homepage
def home(request):
    if request.method == "POST":
        form = UploadForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            form.save()
            obj = form.instance
            # redirect to dahboard 
            return redirect('/dashboard')
    else:
        form = UploadForm()

    context = {
        "form": form,
    }
    return render(request, "home.html", context)

#for separeate canvas
def dashboard(request):
    if request.method == 'POST':
        data = request.POST.get('translations')
        categories = Category.objects.create(translations=data)
        categories.save()
        return redirect('dashboard')

    img = Upload.objects.last()
    categories = Category.objects.all().order_by('-id')

    context = {
        'img':img,
        'categories':categories
    }
    return render(request,'dashboard.html',context)

#For labels
def category(request):
    if request.method == 'POST':
        data = request.POST.get('category')
        category = Category.objects.create(translations=data)
        category.save()
        print(data)

    return redirect('/')
