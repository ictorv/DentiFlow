from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'invoices', views.InvoiceViewSet)
router.register(r'invoice-items', views.InvoiceItemViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'insurance-claims', views.InsuranceClaimViewSet)
router.register(r'insurance-providers', views.InsuranceProviderViewSet)
router.register(r'dental-services', views.DentalServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]