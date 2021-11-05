from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages

from .models import UserRating, RecommendMovies, Profile
from .forms import UserForm

import json
import random
import collections

def main(request):
    return render(request, 'home/landing.html')

def home(request):
    return render(request, 'home/home.html')

def detail(request):
    for key, value in request.session.items():
        print('{} => {}'.format(key, value))
    return render(request, 'home/movie.html')

def rating(request):
    if request.method == 'POST' and request.user.is_authenticated:
        data = json.loads(request.body)
        user = request.user
        title = data.get('title', None)
        imdbId = data.get('imdbid', None)
        rating = data.get('rating', None)

        defaults = {'rating':rating}

        print(user, title, imdbId, rating)

        obj, created = UserRating.objects.update_or_create(
            user=user,
            title=title,
            imdbId=imdbId,
            defaults=defaults
        )
        return render(request, 'home/movie.html')
    else:
        return render(request, 'home/movie.html')

def movieDictionary(username):
    output = {}
    user = get_object_or_404(User, username=username)
    try:
        ratings = UserRating.objects.filter(user=user)

        for i, record in enumerate(ratings):
            output[i] = {
                'imdbId': record.imdbId,
                'title': record.title,
                'rating': record.rating
            }

        return output
    except UserRating.DoesNotExist:
        output = {'error':
            {
                "code": 403,
                "message" : "Forbiden",
            }
        }
        return output

def list(request):
    if request.user.is_authenticated:
        movieDict = movieDictionary(request.user.username)
        return JsonResponse(movieDict)
    else:
        return JsonResponse(
            {'error':
                {
                    "code": 401,
                    "message": "Login Required"
                }
            }
        )

def movieList(request):
    return render(request, 'home/movie_list.html')

@login_required(login_url='/accounts/login')
def userSidebar(request):
    context = {}
    if request.user.is_authenticated and request.user.is_staff:
        users = User.objects.all()
        context = {'users' : users}
        for user in users:
            genres = Profile.objects.filter(user=user).values('genre')
            context[user.username] = genres
    return render(request, 'home/user_sidebar.html', context=context)

@login_required(login_url='/accounts/login')
def curation(request, username):
    context = {}
    movies = []
    ratings = []
    if request.user.is_authenticated and request.user.is_staff:
        users = User.objects.all()
        context = {'users': users}
    try:
        user = User.objects.get(username=username)
        genreQueries = Profile.objects.filter(user=user).values('genre')
        ratingQueries = UserRating.objects.filter(user=user).values('title', 'imdbId', 'rating')
        for res in ratingQueries:
            ratings.append(res)
        for q in genreQueries:
            genre = q.get('genre')
            recommendQuery = RecommendMovies.objects.filter(user=user, genre=genre).values('id', 'title', 'est', 'genre').order_by('-est')[:10]
            for res in recommendQuery:
                movies.append(res)
        random.shuffle(movies)
        context['ratings'] = ratings
        context['movies'] = movies[:100]
    except RecommendMovies.DoesNotExist:
        pass
    except Profile.DoesNotExist:
        pass
    return render(request, 'home/curation.html', context)

@login_required(login_url='/accounts/login')
def userCuration(request):
    context = {}
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user.username)
        genreList = Profile.objects.filter(user=user).values('genre')
        context['genres_list'] = genreList

    if request.GET['genre'] != 'Best':
        genre = request.GET['genre']
        movies = []
        recommendList = RecommendMovies.objects.filter(user=request.user, genre=genre).values('title', 'est').order_by('-est')[:80]
        for res in recommendList:
            movies.append(res)
        random.shuffle(movies)
        context['recommend_list'] = movies[:20]
    else:
        context['None'] = 'There is no Recommendation'

    return render(request, 'home/user_curation.html', context)

@login_required(login_url='/accounts/login')
def createUserMeta(request):
    context = {}
    if request.user.is_authenticated and request.user.is_staff:
        users = User.objects.all()
        context = {'users': users}

    if request.method == 'POST':
        userform = UserForm(request.POST)

        if userform.is_valid():
            user = get_object_or_404(User, username=userform.cleaned_data['username'])

            UserRating.objects.create_obj(username=user.username)
            RecommendMovies.objects.create_obj(username=user.username)

            context['info'] = 'Data created'
            return render(request, 'home/user_meta.html', context=context)
        else:
            context['info'] = 'User already have tables'
            return render(request, 'home/user_meta.html', context=context)

    elif request.method == 'GET':
        userform = UserForm()
        context['form'] = userform
    else:
        return HttpResponseNotFound('<h1>Page Not Found</h1>')
    return render(request, 'home/user_meta.html', context)