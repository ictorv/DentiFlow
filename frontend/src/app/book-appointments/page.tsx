"use client";

import { useEffect, useState } from "react";
import axios from "axios";
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

interface Patient {
  id: number;
  name: string;
}

export default function BookAppointment() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState<number | "">("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios
      .get<Patient[]>("http://127.0.0.1:8000/api/patients/")
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      patient: Number(patientId),
      date,
      status: "Scheduled",
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/appointments/", newAppointment);
      alert("Appointment booked!");
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-lg bg-white w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Book Appointment</h2>
      <select
        value={patientId}
        onChange={(e) => setPatientId(Number(e.target.value))}
        required
        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      >
        <option value="">Select Patient</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg w-full font-semibold text-lg hover:bg-blue-600">
        Book Appointment
      </button>
    </form>
  );
}
