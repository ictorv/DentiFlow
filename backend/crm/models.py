from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Canceled', 'Canceled')])

    def __str__(self):
        return f"{self.patient.name} - {self.date}"
