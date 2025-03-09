# clinic/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient, AppointmentType, Appointment
from .serializers import (
    PatientSerializer, 
    AppointmentTypeSerializer, 
    AppointmentSerializer,
    AppointmentCreateSerializer,
    AppointmentCountSerializer
)
from datetime import datetime, timedelta
from django.db.models import Count
from django.db.models.functions import TruncDate

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            patients = Patient.objects.filter(name__icontains=query)
            serializer = self.get_serializer(patients, many=True)
            return Response(serializer.data)
        return Response([])

class AppointmentTypeViewSet(viewsets.ModelViewSet):
    queryset = AppointmentType.objects.all()
    serializer_class = AppointmentTypeSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    @action(detail=False, methods=['get'], url_path='date/(?P<date>\d{4}-\d{2}-\d{2})')
    def by_date(self, request, date=None):
        """Get appointments for a specific date."""
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            appointments = Appointment.objects.filter(
                date=date_obj, 
                status=Appointment.STATUS_SCHEDULED
            )
            serializer = AppointmentSerializer(appointments, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def counts(self, request):
        """Get appointment counts by date for a month."""
        try:
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))
            
            # Get the first and last day of the month
            first_day = datetime(year, month, 1).date()
            if month == 12:
                last_day = datetime(year + 1, 1, 1).date() - timedelta(days=1)
            else:
                last_day = datetime(year, month + 1, 1).date() - timedelta(days=1)
            
            # Query appointment counts for each day in the month
            appointments = Appointment.objects.filter(
                date__gte=first_day,
                date__lte=last_day,
                status=Appointment.STATUS_SCHEDULED
            ).values('date').annotate(count=Count('id'))
            
            # Format the response
            result = []
            for app in appointments:
                result.append({
                    'date': app['date'].strftime('%Y-%m-%d'),
                    'count': app['count']
                })
            
            return Response(result)
        except ValueError:
            return Response(
                {"error": "Invalid year or month parameters"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available time slots for a specific date."""
        try:
            date_str = request.query_params.get('date')
            if not date_str:
                return Response(
                    {"error": "Date parameter is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Get all booked slots for the day
            appointments = Appointment.objects.filter(
                date=date_obj,
                status=Appointment.STATUS_SCHEDULED
            )
            
            # Define clinic hours (9 AM to 5 PM) with 30-minute intervals
            start_hour = 9
            end_hour = 17
            slot_minutes = 30
            
            # Generate all possible slots
            all_slots = []
            slot_time = datetime.combine(date_obj, datetime.min.time().replace(hour=start_hour))
            end_time = datetime.combine(date_obj, datetime.min.time().replace(hour=end_hour))
            
            while slot_time < end_time:
                # Skip lunch hour (1 PM - 2 PM)
                if slot_time.hour != 13:
                    all_slots.append(slot_time.time())
                slot_time += timedelta(minutes=slot_minutes)
            
            # Remove booked slots
            booked_slots = set()
            for appt in appointments:
                # Mark all slots that overlap with this appointment as booked
                appt_start = datetime.combine(date_obj, appt.start_time)
                appt_end = appt_start + timedelta(minutes=appt.duration)
                
                check_time = datetime.combine(date_obj, datetime.min.time().replace(hour=start_hour))
                while check_time < end_time:
                    check_end = check_time + timedelta(minutes=slot_minutes)
                    if check_time.time() in all_slots and (check_time < appt_end and check_end > appt_start):
                        booked_slots.add(check_time.time())
                    check_time += timedelta(minutes=slot_minutes)
            
            available_slots = [t for t in all_slots if t not in booked_slots]
            
            # Format for frontend
            formatted_slots = [t.strftime('%I:%M %p') for t in available_slots]
            
            return Response(formatted_slots)
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )