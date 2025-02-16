from rest_framework import viewsets
from .models import Patient, Appointment
from .serializers import PatientSerializer, AppointmentSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from .models import Patient, Appointment
from .serializers import PatientSerializer, AppointmentSerializer
from rest_framework.permissions import IsAuthenticated

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all()  # Define the base queryset

    def get_queryset(self):
        # Filter queryset to only show patients belonging to the current user
        return Patient.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user when creating a new patient
        serializer.save(user=self.request.user)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Appointment.objects.all()  # Define the base queryset

    def get_queryset(self):
        # Filter queryset to only show appointments belonging to the current user
        return Appointment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user when creating a new appointment
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        # Add validation
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'detail': 'User with this email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Create user with better error handling
        user = User.objects.create(
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            first_name=data['name']
        )
        
        # Generate token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'name': user.first_name,
                'email': user.email
            }
        })
    except KeyError as e:
        return Response(
            {'detail': f'Missing required field: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        data = request.data
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return Response(
                {'detail': 'Email and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get user with better error handling
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            return Response(
                {'detail': 'No user found with this email'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Check password
        if not user.check_password(data['password']):
            return Response(
                {'detail': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        # Generate token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'token': str(refresh.access_token),
            'user': {
                'id': user.id,
                'name': user.first_name,
                'email': user.email
            }
        })
    except Exception as e:
        return Response(
            {'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

# Add a user info endpoint
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'id': user.id,
        'name': user.first_name,
        'email': user.email
    })