import React, { useEffect, useState } from "react";
import { getFirewallStatus, toggleService, togglePort, FirewallRuleResponse } from "../services/firewallAPI";

const FirewallDashboard: React.FC = () => {
  const [status, setStatus] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      const data: FirewallRuleResponse = await getFirewallStatus();
      setStatus(data.rules);
    } catch (error) {
      console.error(error);
      setStatus("Error fetching status");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggleService = async (service: string, action: "on" | "off") => {
    setLoading(true);
    try {
      await toggleService(service, action);
      await fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePort = async (port: number, action: "on" | "off") => {
    setLoading(true);
    try {
      await togglePort(port, action);
      await fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Firewall Dashboard</h2>

      <pre className="bg-gray-900 text-green-400 p-3 rounded mb-4 overflow-auto h-64">
        {status}
      </pre>

      {loading && <p className="text-yellow-400 mb-2">Applying changes...</p>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleToggleService("http", "on")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Enable HTTP
        </button>

        <button
          onClick={() => handleToggleService("http", "off")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Disable HTTP
        </button>

        <button
          onClick={() => handleToggleService("https", "on")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Enable HTTPS
        </button>

        <button
          onClick={() => handleToggleService("https", "off")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Disable HTTPS
        </button>

        <button
          onClick={() => handleTogglePort(8080, "off")}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Block Port 8080
        </button>
      </div>
    </div>
  );
};

export default FirewallDashboard;
	
