from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext as _


class Movie(models.Model):
    id = models.AutoField(_("index"), primary_key=True)
    imdb_id = models.CharField(_("imdb_id"), max_length=255, null=True)
    title = models.CharField(_("title"), max_length=255, null=True)
    genres = models.CharField(_("genres"), max_length=255, null=True)
    poster_path = models.CharField(_("poster_path"), max_length=255, null=True)
    release_date = models.CharField(_("release_date"), max_length=255, null=True)
    runtime = models.FloatField(_("runtime"), null=True)
    vote_average = models.FloatField(_("vote_average"), null=True)

    def __str__(self):
        return self.title

    def get_id(self):
        return self.imdb_id

    def get_post(self):
        return self.poster_path


class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0, validators=[MaxValueValidator(5), MinValueValidator(0)])