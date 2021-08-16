from django.http import HttpResponse
from django.shortcuts import render, redirect
from .form import UploadForm
from .models import Upload, Category
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
import json

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
# def dashboard(request):
#     if request.method == 'POST':
#         data = request.POST.get('translations')
#         categories = Category.objects.create(translations=data)
#         categories.save()
#         return redirect('dashboard')

#     img = Upload.objects.last()
#     categories = Category.objects.all().order_by('-id')

#     context = {
#         'img':img,
#         'categories':categories
#     }
#     return render(request,'dashboard.html',context)

class dashboard(TemplateView):
    template = 'dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['img'] = Upload.objects.last()
        context['categories'] = Category.objects.all().order_by('-id')
        return context

    def post(self, request):
        data = request.POST.get('translations')
        categories = Category.objects.create(translations=data)
        categories.save()
        return redirect('dashboard')
    
    def get(self, request):
        img = Upload.objects.last()
        categories = Category.objects.all().order_by('-id')
        self.context = {
            'img': img,
            'categories': categories
        }
        return render(request,self.template,self.context)

# For updating JSON rects values
@csrf_exempt
def update_rects_values(request):
    if request.method == 'POST':
        print(request.POST.get('rects_values'))
        data = json.loads(request.POST.get('rects_values'))
        img = Upload.objects.last()
        img.json_data = data
        img.save()
    return redirect('/dashboard')

#For labels
def category(request):
    if request.method == 'POST':
        data = request.POST.get('category')
        category = Category.objects.create(translations=data)
        category.save()
        print(data)

    return redirect('/')
