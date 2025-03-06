from django.db import models
from django.utils import timezone
from django.conf import settings

class Invoice(models.Model):
    INVOICE_STATUS = (
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('CANCELLED', 'Cancelled'),
    )
    
    invoice_number = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE, related_name='invoices')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_invoices')
    issue_date = models.DateField(default=timezone.now)
    due_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=INVOICE_STATUS, default='DRAFT')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.patient.full_name}"
    
    def save(self, *args, **kwargs):
        # Calculate total
        tax_amount = self.subtotal * (self.tax_rate / 100)
        self.total = self.subtotal + tax_amount - self.discount
        super().save(*args, **kwargs)
    
    def mark_as_paid(self):
        self.status = 'PAID'
        self.save()
    
    def mark_as_overdue(self):
        if self.status != 'PAID' and timezone.now().date() > self.due_date:
            self.status = 'OVERDUE'
            self.save()


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    service = models.ForeignKey('DentalService', on_delete=models.SET_NULL, null=True)
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        
        # Update invoice subtotal
        invoice_items = self.invoice.items.all()
        subtotal = sum(item.total_price for item in invoice_items)
        self.invoice.subtotal = subtotal
        self.invoice.save()
    
    def __str__(self):
        return f"{self.description} - {self.invoice.invoice_number}"


class Payment(models.Model):
    PAYMENT_METHODS = (
        ('CASH', 'Cash'),
        ('CARD', 'Credit/Debit Card'),
        ('CHECK', 'Check'),
        ('TRANSFER', 'Bank Transfer'),
        ('INSURANCE', 'Insurance'),
    )
    
    PAYMENT_STATUS = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    )
    
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='CASH')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='PENDING')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment of {self.amount} for {self.invoice.invoice_number}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Check if invoice is fully paid
        invoice = self.invoice
        total_paid = sum(payment.amount for payment in invoice.payments.filter(status='COMPLETED'))
        
        if total_paid >= invoice.total:
            invoice.mark_as_paid()


class InsuranceClaim(models.Model):
    CLAIM_STATUS = (
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('IN_PROCESS', 'In Process'),
        ('DENIED', 'Denied'),
        ('PARTIALLY_PAID', 'Partially Paid'),
        ('PAID', 'Paid'),
    )
    
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='insurance_claims')
    insurance_provider = models.ForeignKey('InsuranceProvider', on_delete=models.CASCADE)
    claim_number = models.CharField(max_length=50, blank=True, null=True)
    submission_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=15, choices=CLAIM_STATUS, default='DRAFT')
    amount_claimed = models.DecimalField(max_digits=10, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    denial_reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Claim {self.claim_number} - {self.insurance_provider.name}"


class InsuranceProvider(models.Model):
    name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name


class DentalService(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)  # Service/procedure code
    description = models.TextField()
    default_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __str__(self):
        return self.full_name
    
    class Meta:
        ordering = ['last_name', 'first_name']


class PatientInsurance(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='insurance_details')
    insurance_provider = models.ForeignKey('billing.InsuranceProvider', on_delete=models.CASCADE)
    policy_number = models.CharField(max_length=50)
    group_number = models.CharField(max_length=50, blank=True, null=True)
    primary_holder_name = models.CharField(max_length=100, blank=True, null=True)
    relationship_to_patient = models.CharField(max_length=20, blank=True, null=True) 
    coverage_start_date = models.DateField()
    coverage_end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.insurance_provider.name}"