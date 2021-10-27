from django.shortcuts import render
from django.views.generic import ListView
from django.db.models import Q
from .models import Movie


def main(request):
    return render(request, 'base.html')

def detail(request):
    for key, value in request.session.items():
        print('{} => {}'.format(key, value))
    return render(request, 'movie.html')

def recommend(request):
    for key, value in request.session.items():
        print('{} => {}'.format(key, value))
    return render(request, 'test.html')