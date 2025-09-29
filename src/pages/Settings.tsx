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
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Key,
  RefreshCw,
  AlertTriangle,
  Save,
  LogOut
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultMode: "learning",
    autoBlock: true,
    logLevel: "normal",
    maxConnections: "1000",
    apiKey: "",
    username: "admin",
    email: "admin@firewall.local",
    notifications: true,
    darkMode: true,
    autoBackup: false
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSave = () => {
    // Save settings logic
    console.log("Settings saved:", settings);
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      defaultMode: "allow_all",
      autoBlock: false,
      logLevel: "normal",
      maxConnections: "1000",
      apiKey: "",
      username: "admin",
      email: "admin@firewall.local",
      notifications: true,
      darkMode: true,
      autoBackup: false
    });
  };

  const generateApiKey = () => {
    const key = "fw_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSettings({...settings, apiKey: key});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your firewall preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Firewall Configuration */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Firewall Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="defaultMode">Default Firewall Mode</Label>
                <Select value={settings.defaultMode} onValueChange={(value) => setSettings({...settings, defaultMode: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow_all">Allow All</SelectItem>
                    <SelectItem value="deny_all">Deny All</SelectItem>
                    <SelectItem value="learning">Learning Mode</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Learning mode automatically creates rules based on traffic patterns
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-block Suspicious IPs</Label>
                  <p className="text-sm text-muted-foreground">Automatically block IPs with suspicious activity</p>
                </div>
                <Switch 
                  checked={settings.autoBlock} 
                  onCheckedChange={(checked) => setSettings({...settings, autoBlock: checked})}
                />
              </div>

              <div>
                <Label htmlFor="maxConnections">Max Concurrent Connections</Label>
                <Input
                  id="maxConnections"
                  type="number"
                  value={settings.maxConnections}
                  onChange={(e) => setSettings({...settings, maxConnections: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="logLevel">Logging Level</Label>
                <Select value={settings.logLevel} onValueChange={(value) => setSettings({...settings, logLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="verbose">Verbose</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                    placeholder="Enter API key for automation"
                  />
                  <Button variant="outline" onClick={generateApiKey}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Used for external automation and monitoring tools
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch 
                  checked={settings.notifications} 
                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Backup Rules</Label>
                  <p className="text-sm text-muted-foreground">Daily backup of firewall rules</p>
                </div>
                <Switch 
                  checked={settings.autoBackup} 
                  onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button onClick={handleSave} className="bg-gradient-cyber">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Account */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                User Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-cyber flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{settings.username}</p>
                      <p className="text-sm text-muted-foreground">{settings.email}</p>
                    </div>
                  </div>
                  
                  <Badge className="bg-success text-success-foreground">
                    Administrator
                  </Badge>
                  
                  <Button variant="outline" className="w-full text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input placeholder="Username" />
                  <Input type="password" placeholder="Password" />
                  <Button className="w-full bg-gradient-cyber">Sign In</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Firewall Status</span>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Update</span>
                <span className="text-sm">2 hours ago</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version</span>
                <span className="text-sm font-mono">v2.1.4</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-sm">7 days, 14 hours</span>
              </div>

              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check for Updates
              </Button>
            </CardContent>
          </Card>

          {/* Security Alert */}
          <Card className="shadow-card border-warning">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Security Notice</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your API key should be rotated every 90 days for security.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;