from rest_framework import serializers
from .models import Patient, Appointment

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'email', 'phone', 'date_of_birth', 'created_at']
        read_only_fields = ['created_at']

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'date', 'status']