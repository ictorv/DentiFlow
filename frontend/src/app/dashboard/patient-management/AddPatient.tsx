"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

interface AddPatientProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: (patient: any) => void;
}

const AddPatient: React.FC<AddPatientProps> = ({ isOpen, onClose, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    last_visit: new Date().toISOString().split("T")[0],
    next_appointment: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0],
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    last_visit: "",
    next_appointment: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "", last_visit: "", next_appointment: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
      valid = false;
    }

    if (!formData.phone.trim() || !/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number (10-15 digits).";
      valid = false;
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.last_visit > today) {
      newErrors.last_visit = "Last visit cannot be in the future.";
      valid = false;
    }

    if (formData.next_appointment <= formData.last_visit) {
      newErrors.next_appointment = "Next appointment must be after the last visit.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/patients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const createdPatient = await response.json();
        onPatientAdded(createdPatient);
        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "",
          last_visit: new Date().toISOString().split("T")[0],
          next_appointment: new Date(new Date().setDate(new Date().getDate() + 30))
            .toISOString()
            .split("T")[0],
        });
        setErrors({ name: "", email: "", phone: "", last_visit: "", next_appointment: "" });
      } else {
        const errorData = await response.json();
        alert(`Failed to add patient: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Error adding patient.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/** Name Field **/}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/** Email Field **/}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/** Phone Field **/}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/** Last Visit Field **/}
            <div>
              <label htmlFor="last_visit" className="block text-sm font-medium text-gray-700">
                Last Visit
              </label>
              <input
                type="date"
                id="last_visit"
                name="last_visit"
                value={formData.last_visit}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.last_visit && <p className="text-red-500 text-xs mt-1">{errors.last_visit}</p>}
            </div>

            {/** Next Appointment Field **/}
            <div>
              <label htmlFor="next_appointment" className="block text-sm font-medium text-gray-700">
                Next Appointment
              </label>
              <input
                type="date"
                id="next_appointment"
                name="next_appointment"
                value={formData.next_appointment}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.next_appointment && (
                <p className="text-red-500 text-xs mt-1">{errors.next_appointment}</p>
              )}
            </div>
          </div>

          {/** Buttons **/}
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;