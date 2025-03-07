"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Edit, Trash2, Filter, 
  ChevronLeft, ChevronRight, MoreHorizontal, Stethoscope 
} from "lucide-react";
import AddPatient from "./AddPatient";
import Link from "next/link";

const PatientManagementPage = () => {
  const [patients, setPatients] = useState([]); // Ensure patients is an array
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/patients/");
        const data = await response.json();
        setPatients(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]); // Fallback to empty array in case of error
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = async () => {
    const newPatient = {
      name: "New Patient",
      email: "new.patient@example.com",
      phone: "(555) 000-0000",
      last_visit: new Date().toISOString().split("T")[0],
      next_appointment: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0],
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/patients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        const createdPatient = await response.json();
        setPatients((prev) => [...prev, createdPatient]); // Update state
        alert("Patient added successfully!");
      } else {
        alert("Failed to add patient.");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Error adding patient.");
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      const response = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (response.ok) {
        setPatients(patients.filter((patient) => patient.id !== id));
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  
  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">Dental CRM</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Dashboard
              </Link>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="mt-1 text-gray-600">Manage your patients&apos; records and treatment plans</p>
          </div>
          <button
            onClick={handleAddPatient}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Patient
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-gray-500" /> Filter
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Appointment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{patient.name}</td>
                    <td className="px-6 py-4">{patient.email}<br/>{patient.phone}</td>
                    <td className="px-6 py-4">{new Date(patient.last_visit).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(patient.next_appointment).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagementPage;
