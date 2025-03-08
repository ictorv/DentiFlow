// app/dashboard/page.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Add this import
import axios from 'axios';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Menu,
  LogOut,
  Search,
  Clock,
  Stethoscope
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter(); // Add this hook
  
  // Add this function
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');
    
    // Clear the Authorization header if using axios
    if (axios.defaults.headers.common['Authorization']) {
      delete axios.defaults.headers.common['Authorization'];
    }
    
    // Redirect to login page
    router.push('/');
  };

  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      icon: Users,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Today's Appointments",
      value: "8",
      icon: Calendar,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "$52,420",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const appointments = [
    { time: "09:00 AM", patient: "John Doe", type: "Cleaning" },
    { time: "10:30 AM", patient: "Sarah Smith", type: "Check-up" },
    { time: "02:00 PM", patient: "Mike Johnson", type: "Root Canal" },
    { time: "03:30 PM", patient: "Emily Brown", type: "Consultation" },
  ];

  // Quick actions for the dashboard
  const quickActions = [
    {
      title: "Smart Scheduling",
      description: "AI-powered appointment management",
      icon: Clock,
      color: "bg-blue-100 text-blue-600",
      link: "/dashboard/smart-scheduling"
    },
    {
      title: "Patient Records",
      description: "View and manage patient information",
      icon: Users,
      color: "bg-green-100 text-green-600",
      link: "/dashboard/patient-management"
    },
    {
      title: "Analytics",
      description: "Clinic performance and insights",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      link: "#"
    }
  ];

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-4 text-xl font-semibold">DentiFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center text-gray-600 hover:text-gray-900"
              onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. Smith</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening at your clinic today</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link 
              href={action.link} 
              key={index} 
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Appointments</h2>
            <Link 
              href="/dashboard/smart-scheduling" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span>View Calendar</span>
              <Calendar className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {appointments.map((apt, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{apt.patient}</p>
                    <p className="text-sm text-gray-500">{apt.type}</p>
                  </div>
                </div>
                <span className="text-gray-600">{apt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}