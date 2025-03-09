# clinic/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from accounts.models import User

class Patient(models.Model):
    """Model representing a patient."""
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    preferred_time = models.CharField(
        max_length=10,
        choices=[
            ('Morning', 'Morning'),
            ('Afternoon', 'Afternoon'),
            ('Evening', 'Evening'),
        ],
        blank=True,
        null=True
    )
    last_visit = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class AppointmentType(models.Model):
    """Model representing types of dental appointments."""
    name = models.CharField(max_length=100)
    default_duration = models.IntegerField(help_text="Duration in minutes")
    color_code = models.CharField(max_length=20, default="#3498db")
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Appointment(models.Model):
    """Model representing a patient appointment."""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    appointment_type = models.ForeignKey(AppointmentType, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    start_time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    notes = models.TextField(blank=True, null=True)
   
    # Status choices
    STATUS_SCHEDULED = 'scheduled'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_NO_SHOW = 'no_show'
   
    STATUS_CHOICES = [
        (STATUS_SCHEDULED, _('Scheduled')),
        (STATUS_COMPLETED, _('Completed')),
        (STATUS_CANCELLED, _('Cancelled')),
        (STATUS_NO_SHOW, _('No Show')),
    ]
   
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_SCHEDULED,
    )
   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'start_time']
    
    @property
    def end_time(self):
        """Calculate end time based on start_time and duration."""
        from datetime import datetime, timedelta
        start_datetime = datetime.combine(datetime.today(), self.start_time)
        end_datetime = start_datetime + timedelta(minutes=self.duration)
        return end_datetime.time()
       
    def __str__(self):
        return f"{self.patient.name} - {self.date} {self.start_time}"