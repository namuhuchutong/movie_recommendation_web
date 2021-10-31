from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    imdbId = models.CharField(max_length=255, null=True)
    rating = models.IntegerField(default=0,
                                 validators=[
                                     MaxValueValidator(5),
                                     MinValueValidator(0)
                                 ]
                            )

class RecommendMovies(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tmdbId = models.CharField(max_length=255, null=True)
    title = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.title

    def getId(self):
        return self.tmdbId