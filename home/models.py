from django.db import models
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

import requests

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    genre = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.genre


class UserRatingManager(models.Manager):

    def create_obj(self, username):
        user = get_object_or_404(User, username=username)
        base = 'http://127.0.0.1:5000/api/userInfo'
        param = '?id=' + username
        path = base + param

        res = requests.get(path)
        if res.status_code == 200:
            ratinglist = res.json()
            for item in ratinglist:
                imdbId = item['movieId']
                rating = int(item['rating'])
                title = item['title']

                defaults={'rating':rating}
                print(user, title, imdbId, rating)
                obj, created = UserRating.objects.update_or_create(
                    user=user,
                    imdbId=imdbId,
                    title=title,
                    defaults=defaults
                )


class UserRating(models.Model):

    objects = UserRatingManager()

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    imdbId = models.CharField(max_length=255, null=True)
    title = models.CharField(max_length=255, null=True)
    rating = models.IntegerField(default=0,
                                 validators=[
                                     MaxValueValidator(5),
                                     MinValueValidator(0)
                                 ]
                            )


class RecommendMoviesManager(models.Manager):

    def create_obj(self, username):
        user = get_object_or_404(User, username=username)
        movies = UserRating.objects.filter(user=user)
        base = 'http://127.0.0.1:5000/api/userId'
        param = '?id=' + username
        genreset = set([])

        for query in movies:
            queryTitle = query.title
            url = base + '/' + queryTitle + param
            res = requests.get(url)

            if res.status_code == 200:
                movielist = res.json()
                print(movielist)
                for output in movielist:
                    title = output['title']
                    tmdbId = output['id']
                    genres = output['genres']
                    est = output['est']
                    defaults = {'est': est}

                    for genre in genres:
                        obj, created = RecommendMovies.objects.update_or_create(
                            user=user,
                            tmdbId=tmdbId,
                            title=title,
                            genre=genre,
                            defaults=defaults
                        )
                        print(username, title, tmdbId, genre, est)
                        genreset.add(genre)
        for g in genreset:
            obj = Profile.objects.create(
                user=user,
                genre=g
            )
            obj.save()


class RecommendMovies(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tmdbId = models.CharField(max_length=255, null=True)
    title = models.CharField(max_length=255, null=True)
    genre = models.CharField(max_length=255, null=True)
    est = models.FloatField(default=0, null=True)

    objects = RecommendMoviesManager()

    def __str__(self):
        return self.title

    def getId(self):
        return self.tmdbId

    def getGenre(self):
        return self.genre