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
    end_time = serializers.TimeField(read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'appointment_type', 'appointment_type_name',
            'date', 'start_time', 'end_time', 'duration', 'notes', 'status',
            'created_at', 'updated_at'
        ]
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Format time strings to match the frontend expected format
        if 'start_time' in representation:
            time_obj = datetime.strptime(representation['start_time'], '%H:%M:%S').time()
            representation['time'] = time_obj.strftime('%I:%M %p')  # e.g., "09:00 AM"
        if 'end_time' in representation:
            time_obj = datetime.strptime(representation['end_time'], '%H:%M:%S').time()
            representation['endTime'] = time_obj.strftime('%I:%M %p')  # e.g., "09:30 AM"
        return representation

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['patient', 'appointment_type', 'date', 'start_time', 'duration', 'notes']
    
    def validate(self, data):
        """
        Validate that the appointment doesn't conflict with existing appointments.
        """
        start_datetime = datetime.combine(data['date'], data['start_time'])
        end_datetime = start_datetime + timedelta(minutes=data['duration'])
        
        # Check for overlapping appointments
        overlapping = Appointment.objects.filter(
            date=data['date'],
            status=Appointment.STATUS_SCHEDULED
        ).exclude(id=self.instance.id if self.instance else None)
        
        for appt in overlapping:
            appt_start = datetime.combine(appt.date, appt.start_time)
            appt_end = appt_start + timedelta(minutes=appt.duration)
            
            # Check if appointments overlap
            if (start_datetime < appt_end and end_datetime > appt_start):
                raise serializers.ValidationError(
                    f"This appointment overlaps with an existing appointment for {appt.patient.name}"
                )
        
        return data

class AppointmentCountSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()