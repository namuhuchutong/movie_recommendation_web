from django.urls import path, include
from . import views
from django.views.decorators.csrf import csrf_exempt

main_patterns = [
    path('', views.main, name="main"),
    path('movie', views.detail, name="detail"),
    path('rating', csrf_exempt(views.rating), name='rating', ),
    path('list', views.list, name='list'),
    path('movieList', views.movieList, name='movieList'),
    path('home', views.home, name="home"),
]

recommendation_patterns = [
]

urlpatterns = [
    path('', include(main_patterns)),
]