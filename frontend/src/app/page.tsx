"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get<Patient[]>("http://127.0.0.1:8000/api/patients/")
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));
  };

  const addPatient = () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone || !newPatient.date_of_birth) return;
    
    axios.post("http://127.0.0.1:8000/api/patients/", newPatient)
      .then(() => {
        fetchPatients();
        setNewPatient({ name: "", email: "", phone: "", date_of_birth: "" });
      })
      .catch(error => console.error("Error adding patient:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Dental CRM</h1>
      
      {/* Patients List */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Patients List</h2>
        <ul className="space-y-4">
          {patients.map((patient) => (
            <li key={patient.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <p className="text-lg font-medium">{patient.name}</p>
              <p className="text-gray-600">Email: {patient.email}</p>
              <p className="text-gray-600">Phone: {patient.phone}</p>
              <p className="text-gray-600">DOB: {patient.date_of_birth}</p>
              <p className="text-gray-500 text-sm">Added: {new Date(patient.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Add New Patient Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Add New Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={newPatient.name} 
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} 
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={newPatient.email} 
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} 
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="text" 
            placeholder="Phone" 
            value={newPatient.phone} 
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} 
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="date" 
            placeholder="Date of Birth" 
            value={newPatient.date_of_birth} 
            onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })} 
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <button 
          onClick={addPatient} 
          className="bg-blue-500 text-white w-full mt-4 py-3 rounded-lg hover:bg-blue-600 transition">
          Add Patient
        </button>
      </div>
    </div>
  );
}