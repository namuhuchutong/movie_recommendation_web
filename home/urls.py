from django.urls import path, include
from . import views
from django.views.decorators.csrf import csrf_exempt

main_patterns = [
    path('', views.main, name="main"),
    path('movie', views.detail, name="detail"),
    path('rating', csrf_exempt(views.rating), name='rating', ),
    path('list', views.list, name='list'),
    path('ratingList', views.movieList, name='ratingList'),
    path('home', views.home, name="home"),
    path('usersPage', views.userSidebar, name="usersPages"),
    path('curation/<str:username>', views.curation, name="curation"),
    path('userCuration', views.userCuration, name='userCuration'),
]

recommendation_patterns = [
]

urlpatterns = [
    path('', include(main_patterns)),
]