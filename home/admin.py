from django.contrib import admin
from .models import UserRating, RecommendMovies, Profile

admin.site.register(UserRating)
admin.site.register(RecommendMovies)
admin.site.register(Profile)
