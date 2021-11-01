from django.contrib import admin
from .models import UserRating, RecommendMovies

admin.site.register(UserRating)
admin.site.register(RecommendMovies)
