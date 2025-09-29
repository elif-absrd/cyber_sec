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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, Plus, Edit, Trash2, Check, X } from "lucide-react";

interface Rule {
  id: string;
  protocol: string;
  port: string;
  action: "Allow" | "Deny";
  status: "Active" | "Disabled";
  description: string;
}

const Rules = () => {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      protocol: "TCP",
      port: "80",
      action: "Allow",
      status: "Active",
      description: "HTTP Traffic"
    },
    {
      id: "2",
      protocol: "TCP",
      port: "443",
      action: "Allow",
      status: "Active",
      description: "HTTPS Traffic"
    },
    {
      id: "3",
      protocol: "TCP",
      port: "22",
      action: "Deny",
      status: "Active",
      description: "SSH Access Block"
    },
    {
      id: "4",
      protocol: "UDP",
      port: "53",
      action: "Allow",
      status: "Active",
      description: "DNS Resolution"
    },
    {
      id: "5",
      protocol: "ICMP",
      port: "*",
      action: "Allow",
      status: "Disabled",
      description: "Ping Requests"
    }
  ]);

  const [newRule, setNewRule] = useState({
    protocol: "",
    port: "",
    action: "",
    description: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id 
        ? { ...rule, status: rule.status === "Active" ? "Disabled" : "Active" as "Active" | "Disabled" }
        : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const addRule = () => {
    if (newRule.protocol && newRule.port && newRule.action) {
      const rule: Rule = {
        id: Date.now().toString(),
        protocol: newRule.protocol,
        port: newRule.port,
        action: newRule.action as "Allow" | "Deny",
        status: "Active",
        description: newRule.description || `${newRule.action} ${newRule.protocol}/${newRule.port}`
      };
      setRules([...rules, rule]);
      setNewRule({ protocol: "", port: "", action: "", description: "" });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Firewall Rules</h1>
          <p className="text-muted-foreground">Manage your network access rules and policies</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-cyber hover:shadow-cyber transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Add New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Create New Firewall Rule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select value={newRule.protocol} onValueChange={(value) => setNewRule({...newRule, protocol: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TCP">TCP</SelectItem>
                      <SelectItem value="UDP">UDP</SelectItem>
                      <SelectItem value="ICMP">ICMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="port">Port/Range</Label>
                  <Input
                    id="port"
                    placeholder="80, 443, 8000-9000"
                    value={newRule.port}
                    onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="action">Action</Label>
                <Select value={newRule.action} onValueChange={(value) => setNewRule({...newRule, action: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Allow">Allow</SelectItem>
                    <SelectItem value="Deny">Deny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Rule description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                />
              </div>
              
              <Button onClick={addRule} className="w-full bg-gradient-cyber">
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Rules</p>
                <p className="text-foreground text-2xl font-bold">{rules.length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active Rules</p>
                <p className="text-foreground text-2xl font-bold">
                  {rules.filter(rule => rule.status === "Active").length}
                </p>
              </div>
              <Check className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Allow Rules</p>
                <p className="text-foreground text-2xl font-bold">
                  {rules.filter(rule => rule.action === "Allow").length}
                </p>
              </div>
              <Check className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Firewall Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule ID</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-mono text-sm">{rule.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.protocol}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{rule.port}</TableCell>
                  <TableCell>
                    <Badge 
                      className={rule.action === "Allow" 
                        ? "bg-success text-success-foreground" 
                        : "bg-destructive text-destructive-foreground"
                      }
                    >
                      {rule.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.status === "Active"}
                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                      />
                      <span className={`text-sm ${
                        rule.status === "Active" ? "text-success" : "text-muted-foreground"
                      }`}>
                        {rule.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rule.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteRule(rule.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rules;