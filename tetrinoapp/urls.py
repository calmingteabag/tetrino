from tetrinoapp import views
from django.urls import path

urlpatterns = [
    path('', views.TetrinoView.as_view(), name='tetrino'),
]
