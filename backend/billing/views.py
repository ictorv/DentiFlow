from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Invoice, InvoiceItem, Payment, InsuranceClaim, InsuranceProvider, DentalService
from .serializers import (
    InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer,
    InsuranceClaimSerializer, InsuranceProviderSerializer, DentalServiceSerializer
)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-created_at')
    serializer_class = InvoiceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'patient', 'issue_date']
    search_fields = ['invoice_number', 'patient__first_name', 'patient__last_name']
    ordering_fields = ['issue_date', 'due_date', 'total', 'status']
    
    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.mark_as_paid()
        return Response({'status': 'Invoice marked as paid'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        today = timezone.now().date()
        month_start = today.replace(day=1)
        
        total_revenue = Payment.objects.filter(
            status='COMPLETED', 
            payment_date__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        monthly_invoices = Invoice.objects.filter(issue_date__gte=month_start).count()
        monthly_payments = Payment.objects.filter(payment_date__gte=month_start, status='COMPLETED').count()
        
        outstanding_amount = Invoice.objects.filter(
            status__in=['SENT', 'OVERDUE']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        outstanding_count = Invoice.objects.filter(status__in=['SENT', 'OVERDUE']).count()
        
        return Response({
            'total_revenue': total_revenue,
            'monthly_invoices': monthly_invoices,
            'monthly_payments': monthly_payments,
            'outstanding_amount': outstanding_amount,
            'outstanding_count': outstanding_count
        })


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['invoice']


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['invoice', 'payment_method', 'status', 'payment_date']
    search_fields = ['invoice__invoice_number', 'transaction_id']
    ordering_fields = ['payment_date', 'amount']
    
    @action(detail=True, methods=['post'])
    def mark_as_completed(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'COMPLETED'
        payment.save()
        return Response({'status': 'Payment marked as completed'}, status=status.HTTP_200_OK)


class InsuranceClaimViewSet(viewsets.ModelViewSet):
    queryset = InsuranceClaim.objects.all().order_by('-submission_date')
    serializer_class = InsuranceClaimSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'insurance_provider', 'submission_date']
    search_fields = ['claim_number', 'invoice__invoice_number']
    ordering_fields = ['submission_date', 'amount_claimed', 'status']
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        claim = self.get_object()
        new_status = request.data.get('status')
        amount_approved = request.data.get('amount_approved')
        denial_reason = request.data.get('denial_reason')
        
        if new_status:
            claim.status = new_status
        
        if amount_approved is not None:
            claim.amount_approved = amount_approved
            
        if denial_reason:
            claim.denial_reason = denial_reason
            
        claim.save()
        
        # If claim is paid, create a payment
        if new_status == 'PAID' and amount_approved:
            Payment.objects.create(
                invoice=claim.invoice,
                amount=claim.amount_approved,
                payment_method='INSURANCE',
                status='COMPLETED',
                notes=f'Insurance payment for claim {claim.claim_number}'
            )
            
        return Response(InsuranceClaimSerializer(claim).data)


class InsuranceProviderViewSet(viewsets.ModelViewSet):
    queryset = InsuranceProvider.objects.all()
    serializer_class = InsuranceProviderSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'contact_person']


class DentalServiceViewSet(viewsets.ModelViewSet):
    queryset = DentalService.objects.filter(is_active=True)
    serializer_class = DentalServiceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'code']