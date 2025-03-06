import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Save, FileText, Send } from 'lucide-react';

const InvoiceGenerator = () => {
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [invoice, setInvoice] = useState({
    patient: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    tax_rate: 0,
    discount: 0,
    items: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch patients and services from API
    // Replace with your actual API endpoints
    const fetchData = async () => {
      try {
        const patientsResponse = await fetch('/api/patients/');
        const servicesResponse = await fetch('/api/dental-services/');
        
        const patientsData = await patientsResponse.json();
        const servicesData = await servicesResponse.json();
        
        setPatients(patientsData.results || []);
        setServices(servicesData.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { id: Date.now(), service: '', description: '', quantity: 1, unit_price: 0 }
      ]
    });
  };

  const removeItem = (itemId) => {
    setInvoice({
      ...invoice,
      items: invoice.items.filter(item => item.id !== itemId)
    });
  };

  const updateItem = (itemId, field, value) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map(item => {
        if (item.id === itemId) {
          if (field === 'service' && value) {
            // Find the selected service to auto-fill details
            const selectedService = services.find(s => s.id === parseInt(value));
            if (selectedService) {
              return {
                ...item,
                [field]: value,
                description: selectedService.name,
                unit_price: selectedService.default_price
              };
            }
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoice.tax_rate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - invoice.discount;
  };

  const handleSubmit = async (e, status = 'DRAFT') => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create the invoice
      const invoiceResponse = await fetch('/api/invoices/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoice,
          status: status,
          subtotal: calculateSubtotal(),
          total: calculateTotal()
        })
      });
      
      const newInvoice = await invoiceResponse.json();
      
      // Create invoice items
      for (const item of invoice.items) {
        await fetch('/api/invoice-items/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoice: newInvoice.id,
            service: item.service,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price
          })
        });
      }
      
      // Redirect to the invoice details page
      window.location.href = `/dashboard/invoices/${newInvoice.id}`;
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Invoice</h1>
      
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select 
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={invoice.patient}
              onChange={(e) => setInvoice({...invoice, patient: e.target.value})}
              required
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input 
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={invoice.issue_date}
                onChange={(e) => setInvoice({...invoice, issue_date: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={invoice.due_date}
                onChange={(e) => setInvoice({...invoice, due_date: e.target.value})}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Items</label>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                      No items added yet. Click "Add Item" to add services to this invoice.
                    </td>
                  </tr>
                ) : (
                  invoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-2">
                        <select 
                          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={item.service}
                          onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                          required
                        >
                          <option value="">Select service</option>
                          {services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.code} - {service.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="text"
                          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number"
                          min="1"
                          className="block w-16 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number"
                          min="0"
                          step="0.01"
                          className="block w-24 text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value))}
                          required
                        />
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button 
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add Item
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="4"
              value={invoice.notes}
              onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
              placeholder="Add any notes or payment instructions..."
            ></textarea>
          </div>
          <div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tax Rate (%):</span>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-24 text-right text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={invoice.tax_rate}
                  onChange={(e) => setInvoice({...invoice, tax_rate: parseFloat(e.target.value)})}
                />
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax Amount:</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Discount:</span>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-24 text-right text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={invoice.discount}
                  onChange={(e) => setInvoice({...invoice, discount: parseFloat(e.target.value)})}
                />
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span className="text-gray-800 font-medium">Total:</span>
                <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <button 
            type="submit"
            className="px-4 py-2 flex items-center border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" /> Save as Draft
          </button>
          <button 
            type="button"
            onClick={(e) => handleSubmit(e, 'SENT')}
            className="px-4 py-2 flex items-center border border-transparent rounded-md shadow-sm text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" /> Save and Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceGenerator;