# clinic/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime
from .models import Patient, AppointmentType, Appointment
from .serializers import (
    PatientSerializer, 
    AppointmentTypeSerializer,
    AppointmentSerializer,
    AppointmentReadSerializer
)

class PatientViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Patient instances."""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'email', 'phone']
    filterset_fields = ['preferred_time']

class AppointmentTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing AppointmentType instances."""
    queryset = AppointmentType.objects.all()
    serializer_class = AppointmentTypeSerializer
    permission_classes = [IsAuthenticated]

class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Appointment instances."""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['date', 'status', 'patient', 'appointment_type']
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return AppointmentReadSerializer
        return AppointmentSerializer
    
    @action(detail=False, methods=['get'])
    def by_date_range(self, request):
        """Get appointments within a date range."""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {"error": "start_date and end_date query parameters are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Parse dates
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
            # Get appointments in range
            appointments = Appointment.objects.filter(
                date__gte=start_date,
                date__lte=end_date
            )
            
            # Group by date
            result = {}
            for appointment in appointments:
                date_str = appointment.date.strftime('%Y-%m-%d')
                if date_str not in result:
                    result[date_str] = []
                
                serializer = AppointmentReadSerializer(appointment)
                result[date_str].append(serializer.data)
                
            return Response(result)
            
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available time slots for a specific date."""
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response(
                {"error": "date query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Parse date
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Get booked appointments for the date
            appointments = Appointment.objects.filter(
                date=date,
                status='scheduled'
            )
            
            # Define clinic hours
            clinic_hours = {
                # Weekdays (0 = Monday, 6 = Sunday)
                0: {"start": "09:00", "end": "17:00"},  # Monday
                1: {"start": "09:00", "end": "17:00"},  # Tuesday
                2: {"start": "09:00", "end": "17:00"},  # Wednesday
                3: {"start": "09:00", "end": "17:00"},  # Thursday
                4: {"start": "09:00", "end": "17:00"},  # Friday
                5: {"start": "09:00", "end": "13:00"},  # Saturday
                6: None,  # Sunday - Closed
            }
            
            # Get day of week (0 is Monday in Python's datetime)
            day_of_week = date.weekday()
            
            # Check if clinic is open
            if clinic_hours[day_of_week] is None:
                return Response({"available_slots": [], "message": "Clinic is closed on this day"})
            
            # Get clinic hours for the day
            day_hours = clinic_hours[day_of_week]
            start_time = datetime.strptime(day_hours["start"], "%H:%M").time()
            end_time = datetime.strptime(day_hours["end"], "%H:%M").time()
            
            # Generate all possible slots (30 min intervals)
            all_slots = []
            slot_time = datetime.combine(date, start_time)
            slot_end = datetime.combine(date, end_time)
            
            while slot_time < slot_end:
                slot = slot_time.strftime("%H:%M")
                display_slot = slot_time.strftime("%I:%M %p")
                all_slots.append({"time": slot, "display_time": display_slot})
                slot_time = slot_time + timedelta(minutes=30)
            
            # Remove booked slots
            for appointment in appointments:
                appt_start = datetime.combine(date, appointment.start_time)
                appt_end = datetime.combine(date, appointment.end_time)
                
                # Remove any slot that overlaps with this appointment
                all_slots = [
                    slot for slot in all_slots 
                    if not (
                        datetime.combine(date, datetime.strptime(slot["time"], "%H:%M").time()) < appt_end and
                        datetime.combine(date, datetime.strptime(slot["time"], "%H:%M").time()) + timedelta(minutes=30) > appt_start
                    )
                ]
            
            return Response({"available_slots": all_slots})
            
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."}, 
                status=status.HTTP_400_BAD_REQUEST
            )