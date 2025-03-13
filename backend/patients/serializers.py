from rest_framework import serializers
from .models import Patient
import re
from datetime import date

class PatientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True, allow_blank=False)
    email = serializers.EmailField(required=True, allow_blank=False)
    phone = serializers.CharField(required=True, allow_blank=False)
    last_visit = serializers.DateField(required=True)
    next_appointment = serializers.DateField(required=True)

    class Meta:
        model = Patient
        fields = "__all__"

    def validate_phone(self, value):
        phone_regex = r'^\+?\d{10,15}$'  # Allows optional + and 10-15 digits
        if not re.match(phone_regex, value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def validate_last_visit(self, value):
        if value > date.today():
            raise serializers.ValidationError("Last visit date cannot be in the future.")
        return value

    def validate_next_appointment(self, value):
        if value < date.today():
            raise serializers.ValidationError("Next appointment date cannot be in the past.")
        return value

    def validate(self, data):
        """Ensure next appointment is after the last visit."""
        if data.get("next_appointment") and data.get("last_visit"):
            if data["next_appointment"] <= data["last_visit"]:
                raise serializers.ValidationError("Next appointment must be after the last visit.")
        return data
