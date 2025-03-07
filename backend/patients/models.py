from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    last_visit = models.DateField()
    next_appointment = models.DateField()

    def __str__(self):
        return self.name
