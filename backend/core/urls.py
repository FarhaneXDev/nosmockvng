from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'app': 'Nosmokvng API',
        'version': '1.0.0',
        'message': 'API opérationnelle pour l’accompagnement à l’arrêt du tabac.'
    })

urlpatterns = [
    path('', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
