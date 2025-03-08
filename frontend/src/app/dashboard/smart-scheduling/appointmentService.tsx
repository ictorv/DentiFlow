// app/services/appointmentService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/clinic';

const appointmentService = {
  // Get all appointment types
  getAppointmentTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/appointment-types/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment types:', error);
      throw error;
    }
  },
  
  // Get all patients
  getPatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/patients/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },
  
  // Get appointments for a specific date
  getAppointmentsByDate: async (date) => {
    try {
      const formattedDate = formatDate(date);
      const response = await axios.get(`${API_URL}/appointments/`, {
        params: { date: formattedDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  
  // Get appointments for a date range
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      const response = await axios.get(`${API_URL}/appointments/by_date_range/`, {
        params: { 
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  },
  
  // Get available time slots for a specific date
  getAvailableSlots: async (date) => {
    try {
      const formattedDate = formatDate(date);
      const response = await axios.get(`${API_URL}/appointments/available_slots/`, {
        params: { date: formattedDate }
      });
      return response.data.available_slots;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const formattedData = {
        ...appointmentData,
        date: formatDate(appointmentData.date),
        // Convert time from "09:00" format to "09:00:00" if needed
        start_time: appointmentData.start_time.includes(':') ? 
          appointmentData.start_time : 
          `${appointmentData.start_time}:00`,
        // Calculate end_time based on duration if not provided
        end_time: appointmentData.end_time || null
      };
      
      const response = await axios.post(`${API_URL}/appointments/`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Update an existing appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const formattedData = {
        ...appointmentData,
        date: formatDate(appointmentData.date),
        start_time: appointmentData.start_time.includes(':') ? 
          appointmentData.start_time : 
          `${appointmentData.start_time}:00`,
      };
      
      const response = await axios.put(`${API_URL}/appointments/${id}/`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id) => {
    try {
      await axios.delete(`${API_URL}/appointments/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export default appointmentService;