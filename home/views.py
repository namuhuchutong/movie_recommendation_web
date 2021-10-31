from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse

from .models import UserRating

import json

def main(request):
    return render(request, 'base.html')

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
            imdbId=imdbId,
            defaults=defaults
        )
        return render(request, 'home/movie.html')
    else:
        return render(request, 'home/movie.html')

def movieDictionary(username):
    output = {}
    user = get_object_or_404(User, username=username)
    ratings = UserRating.objects.filter(user=user)

    for i, record in enumerate(ratings):
        output[i] = {
            'imdbId': record.imdbId,
            'rating': record.rating
        }
    return output

def list(request):
    if request.user.is_authenticated:
        movieDict = movieDictionary(request.user.username)
        return JsonResponse(movieDict)
    else:
        return JsonResponse({'false': 'no user'})

def movieList(request):
    return render(request, 'home/movie_list.html')