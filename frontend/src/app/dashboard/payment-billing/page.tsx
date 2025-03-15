"use client";
import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, PieChart, Settings, Calendar, Search, TrendingUp, Download, Printer, Bell, Users, ChevronDown, Filter } from 'lucide-react';
import InvoiceGenerator from "./InvoiceGenerator";

const PaymentBillingDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for revenue chart
  const revenueData = [
    { month: 'Jan', amount: 18500 },
    { month: 'Feb', amount: 21300 },
    { month: 'Mar', amount: 24500 },
  ];
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment & Billing</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            New Invoice
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Reports
        </button>
        <button 
          onClick={() => setActiveTab('subscriptions')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'subscriptions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Subscriptions
        </button>
        <button 
          onClick={() => setActiveTab('payment-methods')}
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'payment-methods' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Payment Methods
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <InvoiceGenerator />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-gray-700">Total Revenue</h3>
              </div>
              <p className="text-2xl font-bold">$24,500</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium text-gray-700">Invoices</h3>
              </div>
              <p className="text-2xl font-bold">78</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-medium text-gray-700">Payments</h3>
              </div>
              <p className="text-2xl font-bold">65</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center mb-2">
                <PieChart className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-medium text-gray-700">Outstanding</h3>
              </div>
              <p className="text-2xl font-bold">$8,320</p>
              <p className="text-sm text-gray-500">13 invoices</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search invoices, patients..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="relative">
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>All Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 'INV-5024', patient: 'Sarah Johnson', date: '03/05/2025', amount: '$350.00', status: 'Paid' },
                    { id: 'INV-5023', patient: 'Michael Smith', date: '03/04/2025', amount: '$780.00', status: 'Pending' },
                    { id: 'INV-5022', patient: 'Emma Davis', date: '03/02/2025', amount: '$145.00', status: 'Paid' },
                    { id: 'INV-5021', patient: 'Ryan Wilson', date: '03/01/2025', amount: '$920.00', status: 'Overdue' },
                    { id: 'INV-5020', patient: 'Jessica Brown', date: '02/28/2025', amount: '$215.00', status: 'Paid' },
                  ].map((invoice, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.patient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">5</span> of <span className="font-medium">28</span> invoices
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Revenue Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-700">Revenue Trend</h3>
                <div className="flex items-center space-x-2">
                  <select className="block w-full pl-3 pr-10 py-2 text-xs border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
              </div>
              
              <div className="h-64 flex items-end space-x-6 mb-4">
                {revenueData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t-sm" style={{height: `${(item.amount / 25000) * 100}%`}}></div>
                    <div className="text-xs font-medium text-gray-600 mt-2">{item.month}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">Total Revenue: <span className="font-semibold text-gray-700">$64,300</span></div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +12.4% from previous period
                </div>
              </div>
            </div>
            
          
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-700">Payment Methods</h3>
                <div className="text-xs text-gray-500">Last 30 days</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Credit Card</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Insurance</span>
                    <span className="text-sm font-medium">24%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Bank Transfer</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Financial Reports</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-800 mb-2">Monthly Income Statement</h3>
                <p className="text-sm text-gray-500">Summary of revenues, expenses, and profit for the month</p>
                <div className="flex justify-end mt-4">
                  <Download className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-800 mb-2">Quarterly Revenue Report</h3>
                <p className="text-sm text-gray-500">Detailed breakdown of revenue streams and trends</p>
                <div className="flex justify-end mt-4">
                  <Download className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                <h3 className="font-medium text-gray-800 mb-2">Annual Financial Summary</h3>
                <p className="text-sm text-gray-500">Complete financial overview for the fiscal year</p>
                <div className="flex justify-end mt-4">
                  <Download className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Schedule Reports */}
            <div className="border border-gray-200 rounded-lg p-4 mt-6">
              <h3 className="font-medium text-gray-800 mb-4">Schedule Report Delivery</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Report Type</label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Income Statement</option>
                    <option>Revenue Report</option>
                    <option>Outstanding Invoices</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Recipients</label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Accounting Team</option>
                    <option>Management</option>
                    <option>Custom...</option>
                  </select>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Patient Subscriptions</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              New Subscription Plan
            </button>
          </div>
          
          {/* Active Subscription Plans */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-4">Active Subscription Plans</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billing Cycle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Basic Care Plan', price: '$49.99', cycle: 'Monthly', subscribers: 32, status: 'Active' },
                    { name: 'Family Coverage', price: '$129.99', cycle: 'Monthly', subscribers: 24, status: 'Active' },
                    { name: 'Premium Health', price: '$199.99', cycle: 'Monthly', subscribers: 18, status: 'Active' },
                    { name: 'Senior Care Plus', price: '$89.99', cycle: 'Monthly', subscribers: 15, status: 'Active' },
                  ].map((plan, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {plan.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.cycle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.subscribers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {plan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Disable</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Subscription Activities */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">Recent Subscription Activities</h3>
            <div className="space-y-4">
              {[
                { patient: 'Thomas Wilson', action: 'subscribed to', plan: 'Basic Care Plan', time: '2 hours ago' },
                { patient: 'Emily Johnson', action: 'cancelled', plan: 'Premium Health', time: '5 hours ago' },
                { patient: 'Robert Lee', action: 'upgraded to', plan: 'Family Coverage', time: '1 day ago' },
                { patient: 'Jennifer Adams', action: 'renewed', plan: 'Senior Care Plus', time: '2 days ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{activity.patient}</span> {activity.action} <span className="font-medium">{activity. plan}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payment-methods' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Payment Method
            </button>
          </div>
          
          {/* Payment Gateways */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">Payment Gateways</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Credit Card</h4>
                  <p className="text-sm text-gray-500">Stripe, PayPal, Square</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Bank Transfer</h4>
                  <p className="text-sm text-gray-500">ACH, Wire Transfer</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Insurance</h4>
                  <p className="text-sm text-gray-500">Direct insurance billing</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Payment Plans</h4>
                  <p className="text-sm text-gray-500">Installment payments</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Setup Required</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Settings */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">Payment Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">Payment Reminders</h4>
                    <p className="text-sm text-gray-500">Send automated reminders for upcoming and overdue payments</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="toggle-reminders" className="opacity-0 w-0 h-0" defaultChecked />
                  <label htmlFor="toggle-reminders" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="block h-6 w-6 rounded-full bg-white transform translate-x-6 transition"></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">Patient Payment Portal</h4>
                    <p className="text-sm text-gray-500">Allow patients to view and pay invoices online</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="toggle-portal" className="opacity-0 w-0 h-0" defaultChecked />
                  <label htmlFor="toggle-portal" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="block h-6 w-6 rounded-full bg-white transform translate-x-6 transition"></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-800">Auto Reconciliation</h4>
                    <p className="text-sm text-gray-500">Automatically match payments with invoices</p>
                  </div>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="toggle-reconciliation" className="opacity-0 w-0 h-0" />
                  <label htmlFor="toggle-reconciliation" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="block h-6 w-6 rounded-full bg-white transform transition"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* API Keys */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-700">API Keys</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">Generate New Key</button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-800">Production API Key</h4>
                  <p className="text-sm text-gray-500">Last used: March 10, 2025</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Test API Key</h4>
                  <p className="text-sm text-gray-500">Last used: March 12, 2025</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel - New Feature */}
      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none">
            <Bell className="h-5 w-5" />
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentBillingDashboard;