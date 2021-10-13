from django.urls import path, include
from . import views

main_patterns = [
    path('', views.main, name="main"),
]

recommendation_patterns = [
]

urlpatterns = [
    path('', include(main_patterns)),
]