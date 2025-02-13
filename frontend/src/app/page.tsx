"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Stethoscope } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  created_at: string;
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get<Patient[]>("http://127.0.0.1:8000/api/patients/")
      .then(response => setPatients(response.data))
      .catch(error => {
        console.error("Error fetching patients:", error.response?.data || error.message);
        setError("Failed to fetch patients");
      });
  };

  const addPatient = () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone || !newPatient.date_of_birth) {
      setError("Please fill in all fields");
      return;
    }

    // Format the date to YYYY-MM-DD
    const formattedDate = new Date(newPatient.date_of_birth).toISOString().split('T')[0];
    
    const patientData = {
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      date_of_birth: formattedDate
    };

    console.log("Sending data to API:", patientData); // Debug log

    axios.post("http://127.0.0.1:8000/api/patients/", patientData)
      .then(() => {
        fetchPatients();
        setNewPatient({ name: "", email: "", phone: "", date_of_birth: "" });
        setError("");
      })
      .catch(error => {
        console.error("Error response:", error.response?.data || error.message);
        setError(error.response?.data?.detail || "Failed to add patient");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-3 text-2xl font-bold text-gray-900">Dental CRM</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Add New Patient Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Patient</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={newPatient.date_of_birth}
                onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
          <button
            onClick={addPatient}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors font-medium"
          >
            Add Patient
          </button>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Patients List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="w-16 text-gray-500">Email:</span>
                      {patient.email}
                    </p>
                    <p className="flex items-center">
                      <span className="w-16 text-gray-500">Phone:</span>
                      {patient.phone}
                    </p>
                    <p className="flex items-center">
                      <span className="w-16 text-gray-500">DOB:</span>
                      {patient.date_of_birth}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 pt-2 border-t">
                    Added: {new Date(patient.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}