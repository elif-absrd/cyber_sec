import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FileText, Download, Filter, Search, Calendar, Shield } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: string;
  port: number;
  action: "Allowed" | "Blocked";
  bytes: number;
  country: string;
}

const Logs = () => {
  const [logs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2024-01-20 14:32:15",
      sourceIp: "192.168.1.100",
      destIp: "8.8.8.8",
      protocol: "UDP",
      port: 53,
      action: "Allowed",
      bytes: 64,
      country: "US"
    },
    {
      id: "2", 
      timestamp: "2024-01-20 14:31:42",
      sourceIp: "203.0.113.45",
      destIp: "192.168.1.10",
      protocol: "TCP",
      port: 22,
      action: "Blocked",
      bytes: 0,
      country: "CN"
    },
    {
      id: "3",
      timestamp: "2024-01-20 14:30:18",
      sourceIp: "192.168.1.50",
      destIp: "140.82.114.4",
      protocol: "TCP",
      port: 443,
      action: "Allowed",
      bytes: 2048,
      country: "US"
    },
    {
      id: "4",
      timestamp: "2024-01-20 14:29:33",
      sourceIp: "198.51.100.23",
      destIp: "192.168.1.10",
      protocol: "TCP",
      port: 80,
      action: "Blocked",
      bytes: 0,
      country: "RU"
    },
    {
      id: "5",
      timestamp: "2024-01-20 14:28:55",
      sourceIp: "192.168.1.20",
      destIp: "172.217.14.142",
      protocol: "TCP",
      port: 443,
      action: "Allowed",
      bytes: 1536,
      country: "US"
    },
    {
      id: "6",
      timestamp: "2024-01-20 14:27:12",
      sourceIp: "10.0.0.15",
      destIp: "1.1.1.1",
      protocol: "UDP",
      port: 53,
      action: "Allowed",
      bytes: 84,
      country: "US"
    },
    {
      id: "7",
      timestamp: "2024-01-20 14:26:41",
      sourceIp: "185.220.101.47",
      destIp: "192.168.1.10",
      protocol: "TCP",
      port: 9050,
      action: "Blocked",
      bytes: 0,
      country: "DE"
    },
    {
      id: "8",
      timestamp: "2024-01-20 14:25:03",
      sourceIp: "192.168.1.75",
      destIp: "13.107.42.14",
      protocol: "TCP",
      port: 443,
      action: "Allowed",
      bytes: 3072,
      country: "US"
    }
  ]);

  const [filters, setFilters] = useState({
    timeRange: "1h",
    protocol: "all",
    action: "all",
    search: ""
  });

  const filteredLogs = logs.filter(log => {
    if (filters.protocol !== "all" && log.protocol !== filters.protocol) return false;
    if (filters.action !== "all" && log.action !== filters.action) return false;
    if (filters.search && !log.sourceIp.includes(filters.search) && !log.destIp.includes(filters.search)) return false;
    return true;
  });

  const exportLogs = (format: "csv" | "json") => {
    const data = format === "csv" 
      ? "Timestamp,Source IP,Destination IP,Protocol,Port,Action,Bytes,Country\n" +
        filteredLogs.map(log => 
          `${log.timestamp},${log.sourceIp},${log.destIp},${log.protocol},${log.port},${log.action},${log.bytes},${log.country}`
        ).join("\n")
      : JSON.stringify(filteredLogs, null, 2);
    
    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `firewall-logs.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Connection Logs</h1>
          <p className="text-muted-foreground">Monitor network traffic and firewall activity</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportLogs("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportLogs("json")}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Connections</p>
                <p className="text-foreground text-2xl font-bold">{logs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Allowed</p>
                <p className="text-foreground text-2xl font-bold">
                  {logs.filter(log => log.action === "Allowed").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Blocked</p>
                <p className="text-foreground text-2xl font-bold">
                  {logs.filter(log => log.action === "Blocked").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Data Transfer</p>
                <p className="text-foreground text-2xl font-bold">
                  {(logs.reduce((sum, log) => sum + log.bytes, 0) / 1024).toFixed(1)}KB
                </p>
              </div>
              <Download className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={filters.timeRange} onValueChange={(value) => setFilters({...filters, timeRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="protocol">Protocol</Label>
              <Select value={filters.protocol} onValueChange={(value) => setFilters({...filters, protocol: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  <SelectItem value="TCP">TCP</SelectItem>
                  <SelectItem value="UDP">UDP</SelectItem>
                  <SelectItem value="ICMP">ICMP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={filters.action} onValueChange={(value) => setFilters({...filters, action: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Allowed">Allowed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="search">Search IP</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="192.168.1.100"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Connection Logs ({filteredLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Destination IP</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Bytes</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell className="font-mono">{log.sourceIp}</TableCell>
                    <TableCell className="font-mono">{log.destIp}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.protocol}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{log.port}</TableCell>
                    <TableCell>
                      <Badge 
                        className={log.action === "Allowed" 
                          ? "bg-success text-success-foreground" 
                          : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{log.bytes}B</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.country}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;