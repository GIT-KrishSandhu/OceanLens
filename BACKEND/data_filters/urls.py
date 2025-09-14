from django.urls import path
from .views import download_filtered_csv

urlpatterns = [
    path("download/", download_filtered_csv, name="download_csv"),
]
