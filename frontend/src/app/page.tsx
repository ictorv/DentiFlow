"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Patient {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get<Patient[]>("http://127.0.0.1:8000/api/patients/")
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));
  };

  const addPatient = () => {
    if (!newPatient.name || !newPatient.email) return;
    axios.post("http://127.0.0.1:8000/api/patients/", newPatient)
      .then(() => {
        fetchPatients();
        setNewPatient({ name: "", email: "" });
      })
      .catch(error => console.error("Error adding patient:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Dental CRM</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Patients List</h2>
        <ul>
          {patients.map(patient => (
            <li key={patient.id} className="border-b p-2">{patient.name} - {patient.email}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mt-6">
        <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
        <input 
          type="text" 
          placeholder="Name" 
          value={newPatient.name} 
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} 
          className="border p-2 w-full mb-2 rounded" 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newPatient.email} 
          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} 
          className="border p-2 w-full mb-2 rounded" 
        />
        <button 
          onClick={addPatient} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Patient
        </button>
      </div>
    </div>
  );
}
