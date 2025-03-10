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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
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
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;