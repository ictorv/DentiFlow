from django.urls import path
from .views import login, register, get_user_info

urlpatterns = [
    path('api/auth/login/', login, name='login'),
    path('api/auth/register/', register, name='register'),
    path('api/auth/user-info/', get_user_info, name='user-info'),
]