from rest_framework import serializers
from .models import Invoice, InvoiceItem, Payment, InsuranceClaim, InsuranceProvider, DentalService


class DentalServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DentalService
        fields = '__all__'


class InvoiceItemSerializer(serializers.ModelSerializer):
    service_details = DentalServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = InvoiceItem
        fields = ['id', 'invoice', 'service', 'service_details', 'description', 
                  'quantity', 'unit_price', 'total_price']
        read_only_fields = ['total_price']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at']


class InsuranceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceProvider
        fields = '__all__'


class InsuranceClaimSerializer(serializers.ModelSerializer):
    insurance_provider_details = InsuranceProviderSerializer(source='insurance_provider', read_only=True)
    
    class Meta:
        model = InsuranceClaim
        fields = ['id', 'invoice', 'insurance_provider', 'insurance_provider_details', 
                  'claim_number', 'submission_date', 'status', 'amount_claimed', 
                  'amount_approved', 'denial_reason', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    insurance_claims = InsuranceClaimSerializer(many=True, read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    amount_paid = serializers.SerializerMethodField()
    balance_due = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'patient', 'patient_name', 'created_by', 
                  'created_by_name', 'issue_date', 'due_date', 'notes', 'status', 
                  'subtotal', 'tax_rate', 'discount', 'total', 'items', 'payments',
                  'insurance_claims', 'amount_paid', 'balance_due', 'created_at', 'updated_at']
        read_only_fields = ['subtotal', 'total', 'created_at', 'updated_at']
    
    def get_amount_paid(self, obj):
        return sum(payment.amount for payment in obj.payments.filter(status='COMPLETED'))
    
    def get_balance_due(self, obj):
        amount_paid = self.get_amount_paid(obj)
        return obj.total - amount_paid