from django.http import HttpResponse
from django.shortcuts import render, redirect
from .form import UploadForm
from .models import Upload, Category
from django.views.generic import ListView


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
        category = Category.objects.create(translations=data)
        category.save()
        return redirect('dashboard')

    img = Upload.objects.last()
    category = Category.objects.all().order_by('-id')

    context = {
        'img':img,
        'category':category
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

# #For deleting a label by getting its ID
# def delete_label(request, label_id):
#     #Get id we select and delete
#     label = Labels.objects.get(pk=label_id)
#     label.delete()
#     #redirect back
#     return redirect('dashboard')

""" #Searching for a label to be easy
def search_label(request):
    if request.method == 'POST':
        searched = request.POST['searched']
        img = Upload.objects.last()
        context = {
        'img':img,
        'searched':searched
        }
        return render(request,'dashboard.html',context)
        #return render(request,'dashboard.html',{'searched':searched})
    else:
        return render(request,'dashboard.html',{})
 """