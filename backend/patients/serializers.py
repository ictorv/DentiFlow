from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True, allow_blank=False)
    email = serializers.EmailField(required=True, allow_blank=False)
    phone = serializers.CharField(required=True, allow_blank=False)
    last_visit = serializers.DateField(required=True)
    next_appointment = serializers.DateField(required=True)

    class Meta:
        model = Patient
        fields = "__all__"
