"use client";
import { useState } from "react";
import axios from "axios";
import { Appointment } from "../../types";

export default function BookAppointment() {
  const [patientId, setPatientId] = useState<number | "">("");
  const [date, setDate] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Omit<Appointment, "id"> = {
      patient: Number(patientId),
      date,
      status: "Scheduled",
    };

    await axios.post("http://127.0.0.1:8000/api/appointments/", newAppointment);
    alert("Appointment booked!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>
      <input
        type="number"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(Number(e.target.value))}
        required
        className="border p-2 w-full mb-2"
      />
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
