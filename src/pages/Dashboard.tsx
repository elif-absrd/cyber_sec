import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Shield,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  TrendingUp,
  Network,
  Clock
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your network security and firewall status</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-success shadow-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-foreground/80 text-sm font-medium">Firewall Status</p>
                <p className="text-success-foreground text-2xl font-bold">Active</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-success-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Blocked Threats</p>
                <p className="text-foreground text-2xl font-bold">1,247</p>
              </div>
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active Rules</p>
                <p className="text-foreground text-2xl font-bold">42</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Network Traffic</p>
                <p className="text-foreground text-2xl font-bold">98.2%</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Overview */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Network Traffic Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Inbound Traffic</span>
                <span className="text-success font-medium">2.4 GB/s</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-success h-2 rounded-full w-3/4"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Outbound Traffic</span>
                <span className="text-primary font-medium">1.8 GB/s</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-cyber h-2 rounded-full w-1/2"></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Blocked Requests</span>
                <span className="text-destructive font-medium">156/min</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-danger h-2 rounded-full w-1/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Firewall Protection</label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Block All Mode</label>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">DDoS Protection</label>
              <Switch defaultChecked />
            </div>

            <Button className="w-full bg-gradient-cyber hover:shadow-cyber transition-all duration-200">
              <Shield className="h-4 w-4 mr-2" />
              Configure Rules
            </Button>

            <Button variant="outline" className="w-full">
              <Network className="h-4 w-4 mr-2" />
              Port Scanner
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "warning", message: "Suspicious traffic from 192.168.1.100", time: "2 min ago" },
                { type: "danger", message: "Port scan attempt detected", time: "5 min ago" },
                { type: "info", message: "New rule activated: Block SSH", time: "10 min ago" },
                { type: "warning", message: "High bandwidth usage detected", time: "15 min ago" }
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    alert.type === "danger" ? "bg-destructive" :
                    alert.type === "warning" ? "bg-warning" : "bg-primary"
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connection Statistics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Connection Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Connections</span>
                <Badge variant="secondary">2,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Allowed</span>
                <Badge className="bg-success text-success-foreground">2,691</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Blocked</span>
                <Badge variant="destructive">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Ports</span>
                <Badge variant="outline">18</Badge>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-success font-bold">94.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;