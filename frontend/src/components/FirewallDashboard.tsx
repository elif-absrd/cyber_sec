import React, { useEffect, useState } from "react";
import { getFirewallStatus, toggleService, togglePort, controlDomain, FirewallRuleResponse } from "../services/firewallAPI";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";

const FirewallDashboard: React.FC = () => {
  const [status, setStatus] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Domain blocking state
  const [domainInput, setDomainInput] = useState<string>("");
  
  // Port blocking state
  const [portInput, setPortInput] = useState<string>("");

  const fetchStatus = async () => {
    try {
      const data: FirewallRuleResponse = await getFirewallStatus();
      setStatus(data.rules);
    } catch (error) {
      console.error(error);
      setStatus("Error fetching status");
      setMessage({ type: 'error', text: 'Failed to fetch firewall status' });
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleService = async (service: string, action: "on" | "off") => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await toggleService(service, action);
      await fetchStatus();
      setMessage({ 
        type: 'success', 
        text: `${service.toUpperCase()} ${action === 'on' ? 'enabled' : 'disabled'} successfully` 
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePort = async (port: number, action: "on" | "off") => {
    setLoading(true);
    setMessage(null);
    try {
      await togglePort(port, action);
      await fetchStatus();
      setMessage({ 
        type: 'success', 
        text: `Port ${port} ${action === 'on' ? 'allowed' : 'blocked'} successfully` 
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDomain = async () => {
    if (!domainInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter a domain name' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    try {
      const result = await controlDomain(domainInput, "block");
      await fetchStatus();
      setMessage({ 
        type: 'success', 
        text: `Domain ${domainInput} blocked successfully${result.ips ? ` (IPs: ${result.ips.join(', ')})` : ''}` 
      });
      setDomainInput("");
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockDomain = async () => {
    if (!domainInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter a domain name' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    try {
      await controlDomain(domainInput, "unblock");
      await fetchStatus();
      setMessage({ 
        type: 'success', 
        text: `Domain ${domainInput} unblocked successfully` 
      });
      setDomainInput("");
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPort = async (action: "on" | "off") => {
    const port = parseInt(portInput);
    if (isNaN(port) || port < 1 || port > 65535) {
      setMessage({ type: 'error', text: 'Please enter a valid port number (1-65535)' });
      return;
    }
    
    await handleTogglePort(port, action);
    setPortInput("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🛡️ Firewall Control Center</h2>
        <Button onClick={fetchStatus} variant="outline" disabled={loading}>
          🔄 Refresh
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-yellow-600">
          <div className="animate-spin">⚙️</div>
          <span>Applying changes...</span>
        </div>
      )}

      {/* Firewall Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Firewall Rules</CardTitle>
          <CardDescription>Live view of UFW firewall status</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
            {status}
          </pre>
        </CardContent>
      </Card>

      {/* Domain Blocking */}
      <Card>
        <CardHeader>
          <CardTitle>🌐 Domain Blocking</CardTitle>
          <CardDescription>Block or unblock websites by domain name</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <Input
              id="domain"
              type="text"
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBlockDomain()}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleBlockDomain} 
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              🚫 Block Domain
            </Button>
            <Button 
              onClick={handleUnblockDomain} 
              disabled={loading}
              variant="default"
              className="flex-1"
            >
              ✅ Unblock Domain
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Examples: facebook.com, twitter.com, youtube.com
          </div>
        </CardContent>
      </Card>

      {/* Service Control */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Service Control</CardTitle>
          <CardDescription>Enable or disable common network services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => handleToggleService("http", "on")}
              disabled={loading}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              ✅ Enable HTTP
            </Button>
            <Button
              onClick={() => handleToggleService("http", "off")}
              disabled={loading}
              variant="destructive"
            >
              ❌ Disable HTTP
            </Button>
            <Button
              onClick={() => handleToggleService("https", "on")}
              disabled={loading}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              ✅ Enable HTTPS
            </Button>
            <Button
              onClick={() => handleToggleService("https", "off")}
              disabled={loading}
              variant="destructive"
            >
              ❌ Disable HTTPS
            </Button>
            <Button
              onClick={() => handleToggleService("ssh", "on")}
              disabled={loading}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              ✅ Enable SSH
            </Button>
            <Button
              onClick={() => handleToggleService("ssh", "off")}
              disabled={loading}
              variant="destructive"
            >
              ❌ Disable SSH
            </Button>
            <Button
              onClick={() => handleToggleService("dns", "on")}
              disabled={loading}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              ✅ Enable DNS
            </Button>
            <Button
              onClick={() => handleToggleService("dns", "off")}
              disabled={loading}
              variant="destructive"
            >
              ❌ Disable DNS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Port Control */}
      <Card>
        <CardHeader>
          <CardTitle>🔌 Port Control</CardTitle>
          <CardDescription>Allow or block specific ports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="port">Port Number (1-65535)</Label>
            <Input
              id="port"
              type="number"
              placeholder="8080"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomPort('off')}
              min="1"
              max="65535"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleCustomPort('on')} 
              disabled={loading}
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              ✅ Allow Port
            </Button>
            <Button 
              onClick={() => handleCustomPort('off')} 
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              🚫 Block Port
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Quick Actions:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                onClick={() => handleTogglePort(22, "off")}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                🚫 Block SSH (22)
              </Button>
              <Button
                onClick={() => handleTogglePort(3389, "off")}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                🚫 Block RDP (3389)
              </Button>
              <Button
                onClick={() => handleTogglePort(21, "off")}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                🚫 Block FTP (21)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ System Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Backend: http://localhost:8000</Badge>
            <Badge variant="outline">API Docs: http://localhost:8000/docs</Badge>
            <Badge variant={loading ? "default" : "secondary"}>
              Status: {loading ? "Processing..." : "Ready"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirewallDashboard;
	
