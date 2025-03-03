// app/dashboard/smart-scheduling/page.tsx
"use client";
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  X, 
  Check,
  AlertCircle,
  Clock2
} from 'lucide-react';


export default function SmartSchedulingPage() {
  // State for selected date and appointments
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    time: '09:00',
    duration: '30',
    type: 'Check-up'
  });

  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());


  // Mock data for patients
  const patients = [
    { id: 1, name: "John Doe", lastVisit: "2 months ago", preferredTime: "Morning" },
    { id: 2, name: "Sarah Smith", lastVisit: "3 weeks ago", preferredTime: "Afternoon" },
    { id: 3, name: "Mike Johnson", lastVisit: "6 months ago", preferredTime: "Evening" },
    { id: 4, name: "Emily Brown", lastVisit: "1 month ago", preferredTime: "Morning" },
    { id: 5, name: "Robert Wilson", lastVisit: "4 months ago", preferredTime: "Afternoon" }
  ];

  // Mock appointments for the selected day
  const appointments = [
    { id: 1, time: "09:00 AM", endTime: "09:45 AM", patient: "John Doe", type: "Cleaning", duration: 45 },
    { id: 2, time: "10:30 AM", endTime: "11:00 AM", patient: "Sarah Smith", type: "Check-up", duration: 30 },
    { id: 3, time: "02:00 PM", endTime: "03:00 PM", patient: "Mike Johnson", type: "Root Canal", duration: 60 },
    { id: 4, time: "03:30 PM", endTime: "04:00 PM", patient: "Emily Brown", type: "Consultation", duration: 30 },
  ];

  // Mock smart recommendations
  const recommendations = [
    { patient: "Robert Wilson", reason: "Due for 6-month check-up", suggestedTime: "Next Tuesday morning" },
    { patient: "Lisa Martinez", reason: "Follow-up for crown procedure", suggestedTime: "This Friday afternoon" }
  ];

  // Helper function to generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", appointments: 0 });
    }
    
    // Add days of the current month with random appointment counts
    for (let i = 1; i <= daysInMonth; i++) {
      const apptCount = Math.floor(Math.random() * 10);
      days.push({ 
        day: i, 
        appointments: apptCount,
        isToday: i === selectedDate.getDate()
      });
    }
    
    return days;
  };

    // Function to handle navigation between months
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
      }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Function to handle new appointment submission
  const handleAddAppointment = () => {
    // In a real app, this would save the appointment
    console.log("New appointment:", newAppointment);
    setShowAddModal(false);
    // Reset form
    setNewAppointment({
      patient: '',
      time: '09:00',
      duration: '30',
      type: 'Check-up'
    });
  };

  // Get available time slots (simplified)
  const getAvailableSlots = () => {
    return [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
      "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
      "04:00 PM", "04:30 PM"
    ].filter(time => !appointments.some(a => a.time === time));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Smart Scheduling</h1>
          <p className="text-gray-600">Efficiently manage your clinic appointments</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-2">
                <button onClick={handlePreviousMonth} className="p-2 rounded-lg hover:bg-gray-100">
                  Previous
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
<div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`
                      p-2 h-24 border border-gray-100 rounded-lg overflow-hidden
                      ${day.isToday ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'} 
                      ${day.day === "" ? 'bg-gray-50' : 'cursor-pointer'}
                    `}
                    onClick={() => day.day && setSelectedDate(new Date(currentYear, currentMonth, day.day))}
                  >
                    {day.day && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${day.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {day.day}
                          </span>
                          {day.appointments > 0 && (
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              {day.appointments}
                            </span>
                          )}
                        </div>
                        
                        {/* Small appointment indicators */}
                        {day.appointments > 0 && (
                          <div className="mt-2 space-y-1">
                            {day.appointments > 0 && day.appointments <= 3 && Array(day.appointments).fill(0).map((_, i) => (
                              <div key={i} className="h-1.5 w-full bg-blue-200 rounded-full"></div>
                            ))}
                            {day.appointments > 3 && (
                              <>
                                <div className="h-1.5 w-full bg-blue-200 rounded-full"></div>
                                <div className="h-1.5 w-full bg-blue-200 rounded-full"></div>
                                <div className="text-xs text-gray-500 mt-1">+{day.appointments - 2} more</div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Smart Recommendations */}
          <div className="bg-white rounded-xl shadow-sm h-min">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                Smart Recommendations
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-900">{rec.patient}</h3>
                  <p className="text-sm text-blue-700 mt-1">{rec.reason}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs flex items-center text-blue-600">
                      <Clock2 className="h-3 w-3 mr-1" /> {rec.suggestedTime}
                    </span>
                    <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                <h3 className="font-medium text-gray-900">AI Scheduling Assistant</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Optimize your schedule by analyzing patient history and preferences
                </p>
                <button className="mt-3 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded w-full">
                  Run Smart Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Daily Schedule for Selected Date */}
        <div className="mt-6 bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Schedule for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Appointment
            </button>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Appointment Timeline */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Timeline</h3>
                </div>
                <div className="p-4 space-y-4 relative">
                  {/* Time indicator line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                  
                  {appointments.map((apt, index) => (
                    <div key={index} className="pl-8 relative">
                      {/* Time indicator dot */}
                      <div className="absolute left-0 w-4 h-4 rounded-full bg-blue-500 z-10"></div>
                      
                      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{apt.time} - {apt.endTime}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {apt.duration} min
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-gray-900">{apt.patient}</p>
                          <p className="text-sm text-gray-600">{apt.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {appointments.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No appointments scheduled for this day
                    </div>
                  )}
                </div>
              </div>
              
              {/* Available time slots */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Available Slots</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {getAvailableSlots().map((slot, index) => (
                      <button 
                        key={index}
                        className="p-2 text-sm bg-green-50 text-green-700 border border-green-100 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        {slot}
                      </button>
                    ))}
                    
                    {getAvailableSlots().length === 0 && (
                      <div className="text-center py-6 text-gray-500 col-span-3">
                        No available slots for this day
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">New Appointment</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newAppointment.patient}
                    onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
                  >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.name}>{patient.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                  >
                    <option value="Check-up">Check-up</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Filling">Filling</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    >
                      <option value="09:00">9:00 AM</option>
                      <option value="09:30">9:30 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="13:30">1:30 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="14:30">2:30 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="15:30">3:30 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (min)
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newAppointment.duration}
                      onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">60 min</option>
                      <option value="90">90 min</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddAppointment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}