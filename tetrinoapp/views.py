from django.shortcuts import render
from django.views.generic import View


class TetrinoView(View):

    def get(self, request):
        return render(request, 'tetrinoapp/tetrino.html')
