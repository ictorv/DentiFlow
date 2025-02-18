from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from crm.views import PatientViewSet, AppointmentViewSet, login

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', login, name='login'),  # Remove .as_view() here
    path('api/', include(router.urls)),
]
