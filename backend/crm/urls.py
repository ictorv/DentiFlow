from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from crm.views import PatientViewSet, AppointmentViewSet, register, login, get_user_info

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Includes patient & appointment API
    path('api/auth/register/', register, name="register"),
    path('api/auth/login/', login, name="login"),
    path('api/auth/user/', get_user_info, name="user_info"),
]
