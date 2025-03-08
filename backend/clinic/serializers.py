# clinic/serializers.py
from rest_framework import serializers
from .models import Patient, AppointmentType, Appointment
from datetime import datetime, timedelta

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        
class AppointmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentType
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    appointment_type_name = serializers.CharField(source='appointment_type.name', read_only=True)
    
    # For displaying in the frontend
    time = serializers.SerializerMethodField()
    endTime = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'appointment_type', 'appointment_type_name',
            'date', 'start_time', 'end_time', 'duration', 'notes', 'status',
            'time', 'endTime', 'created_at', 'updated_at'
        ]
    
    def get_time(self, obj):
        """Format start_time for frontend display"""
        return obj.start_time.strftime('%I:%M %p')
    
    def get_endTime(self, obj):
        """Format end_time for frontend display"""
        return obj.end_time.strftime('%I:%M %p')
        
    def validate(self, data):
        """
        Check that appointment doesn't overlap with existing appointments.
        """
        date = data.get('date')
        start_time = data.get('start_time')
        duration = data.get('duration')
        
        # If we're updating an existing instance, exclude it from the check
        instance_id = self.instance.id if self.instance else None
        
        # Calculate end time
        start_datetime = datetime.combine(date, start_time)
        end_datetime = start_datetime + timedelta(minutes=duration)
        end_time = end_datetime.time()
        
        # Update data with calculated end_time
        data['end_time'] = end_time
        
        # Check for overlapping appointments
        overlapping = Appointment.objects.filter(
            date=date,
            status='scheduled'
        ).exclude(id=instance_id)
        
        for appointment in overlapping:
            # Convert appointment times to datetime for comparison
            appt_start = datetime.combine(date, appointment.start_time)
            appt_end = datetime.combine(date, appointment.end_time)
            
            # Check for overlap
            if (start_datetime < appt_end and end_datetime > appt_start):
                raise serializers.ValidationError(
                    "This appointment overlaps with an existing appointment."
                )
        
        return data

class AppointmentReadSerializer(AppointmentSerializer):
    """Serializer for reading appointments with additional calculated fields"""
    type = serializers.CharField(source='appointment_type.name')
    
    class Meta(AppointmentSerializer.Meta):
        fields = AppointmentSerializer.Meta.fields + ['type']