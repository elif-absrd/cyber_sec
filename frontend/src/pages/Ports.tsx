import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Network, Globe, Lock, Wifi, Database, Mail, Plus } from "lucide-react";

interface Service {
  name: string;
  port: number;
  protocol: string;
  description: string;
  enabled: boolean;
  icon: React.ElementType;
  category: "web" | "security" | "database" | "communication" | "system";
}

interface CustomPort {
  id: string;
  port: number;
  protocol: string;
  action: "open" | "close";
  description: string;
}

const Ports = () => {
  const [services, setServices] = useState<Service[]>([
    {
      name: "HTTP",
      port: 80,
      protocol: "TCP",
      description: "Web traffic (unencrypted)",
      enabled: true,
      icon: Globe,
      category: "web"
    },
    {
      name: "HTTPS",
      port: 443,
      protocol: "TCP",
      description: "Secure web traffic",
      enabled: true,
      icon: Lock,
      category: "web"
    },
    {
      name: "SSH",
      port: 22,
      protocol: "TCP",
      description: "Secure shell access",
      enabled: false,
      icon: Lock,
      category: "security"
    },
    {
      name: "DNS",
      port: 53,
      protocol: "UDP",
      description: "Domain name resolution",
      enabled: true,
      icon: Network,
      category: "system"
    },
    {
      name: "FTP",
      port: 21,
      protocol: "TCP",
      description: "File transfer protocol",
      enabled: false,
      icon: Database,
      category: "system"
    },
    {
      name: "SMTP",
      port: 25,
      protocol: "TCP",
      description: "Email sending",
      enabled: false,
      icon: Mail,
      category: "communication"
    },
    {
      name: "POP3",
      port: 110,
      protocol: "TCP",
      description: "Email retrieval",
      enabled: false,
      icon: Mail,
      category: "communication"
    },
    {
      name: "IMAP",
      port: 143,
      protocol: "TCP",
      description: "Email access",
      enabled: false,
      icon: Mail,
      category: "communication"
    }
  ]);

  const [customPorts, setCustomPorts] = useState<CustomPort[]>([
    {
      id: "1",
      port: 8080,
      protocol: "TCP",
      action: "open",
      description: "Alternative HTTP"
    },
    {
      id: "2",
      port: 3306,
      protocol: "TCP",
      action: "close",
      description: "MySQL Database"
    }
  ]);

  const [newPort, setNewPort] = useState({
    port: "",
    protocol: "TCP",
    action: "open",
    description: ""
  });

  const toggleService = (index: number) => {
    const updated = [...services];
    updated[index].enabled = !updated[index].enabled;
    setServices(updated);
  };

  const addCustomPort = () => {
    if (newPort.port && newPort.description) {
      const port: CustomPort = {
        id: Date.now().toString(),
        port: parseInt(newPort.port),
        protocol: newPort.protocol,
        action: newPort.action as "open" | "close",
        description: newPort.description
      };
      setCustomPorts([...customPorts, port]);
      setNewPort({ port: "", protocol: "TCP", action: "open", description: "" });
    }
  };

  const removeCustomPort = (id: string) => {
    setCustomPorts(customPorts.filter(port => port.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "web": return "bg-primary text-primary-foreground";
      case "security": return "bg-destructive text-destructive-foreground";
      case "database": return "bg-warning text-warning-foreground";
      case "communication": return "bg-success text-success-foreground";
      case "system": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Ports & Services</h1>
        <p className="text-muted-foreground">Manage network ports and service access controls</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Open Ports</p>
                <p className="text-foreground text-2xl font-bold">
                  {services.filter(s => s.enabled).length + customPorts.filter(p => p.action === "open").length}
                </p>
              </div>
              <Network className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Closed Ports</p>
                <p className="text-foreground text-2xl font-bold">
                  {services.filter(s => !s.enabled).length + customPorts.filter(p => p.action === "close").length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Services</p>
                <p className="text-foreground text-2xl font-bold">{services.length}</p>
              </div>
              <Wifi className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Custom Ports</p>
                <p className="text-foreground text-2xl font-bold">{customPorts.length}</p>
              </div>
              <Database className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Services */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Common Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.name}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(service.category)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {service.protocol}/{service.port}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={service.enabled}
                    onCheckedChange={() => toggleService(index)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Port Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Custom Port */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Custom Port
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="port">Port Number</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="8080"
                  value={newPort.port}
                  onChange={(e) => setNewPort({...newPort, port: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="protocol">Protocol</Label>
                <Select value={newPort.protocol} onValueChange={(value) => setNewPort({...newPort, protocol: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCP">TCP</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={newPort.action} onValueChange={(value) => setNewPort({...newPort, action: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open Port</SelectItem>
                  <SelectItem value="close">Close Port</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Custom service description"
                value={newPort.description}
                onChange={(e) => setNewPort({...newPort, description: e.target.value})}
              />
            </div>
            
            <Button onClick={addCustomPort} className="w-full bg-gradient-cyber">
              Add Port Rule
            </Button>
          </CardContent>
        </Card>

        {/* Custom Ports List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Custom Port Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customPorts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No custom ports configured</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customPorts.map((port) => (
                  <div key={port.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {port.protocol}/{port.port}
                        </Badge>
                        <Badge 
                          className={port.action === "open" 
                            ? "bg-success text-success-foreground" 
                            : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {port.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{port.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomPort(port.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ports;