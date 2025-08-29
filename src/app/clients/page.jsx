"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    company: "",
    status: "Active",
    notes: "",
  });

  // Fetch clients from the API
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/clients");
      setClients(res.data.data);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/clients", form);
      setForm({ name: "", company: "", status: "Active", notes: "" }); // Reset form
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error("Failed to add client", error.response?.data);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Client Management
      </h2>

      {/* Add Client Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Client</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Client Name"
              className="p-2 border rounded-md"
              required
            />
            <input
              name="company"
              value={form.company}
              onChange={handleInputChange}
              placeholder="Company Name"
              className="p-2 border rounded-md"
              required
            />
          </div>
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option>Active</option>
            <option>On Hold</option>
            <option>Completed</option>
            <option>Past Client</option>
          </select>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleInputChange}
            placeholder="Notes"
            className="w-full p-2 border rounded-md h-24"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Client
          </button>
        </form>
      </div>

      {/* Client List Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Client List</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
