import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Shield,
  Network,
  FileText,
  Settings,
  Power,
  AlertTriangle
} from "lucide-react";
import { emergencyStop } from "@/services/firewallAPI";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Rules", url: "/rules", icon: Shield },
  { title: "Ports & Services", url: "/ports", icon: Network },
  { title: "Logs", url: "/logs", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [isEmergencyStopping, setIsEmergencyStopping] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    return path !== "/" && currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      active
        ? "bg-gradient-cyber text-primary-foreground shadow-cyber"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;
  };

  const handleEmergencyStop = async () => {
    const confirmed = window.confirm(
      "⚠️ EMERGENCY STOP\n\n" +
      "This will RESET ALL firewall rules and return UFW to default state.\n\n" +
      "- All custom rules will be deleted\n" +
      "- All blocked domains will be unblocked\n" +
      "- All port blocks will be removed\n" +
      "- Firewall will restart with default deny policy\n\n" +
      "Are you ABSOLUTELY SURE you want to continue?"
    );

    if (!confirmed) return;

    setIsEmergencyStopping(true);
    try {
      const result = await emergencyStop();
      alert(
        "✅ Emergency Stop Executed\n\n" +
        result.message +
        "\n\nThe page will reload to show the new firewall state."
      );
      // Reload the page to refresh all components
      window.location.reload();
    } catch (error: any) {
      alert(
        "❌ Emergency Stop Failed\n\n" +
        error.message +
        "\n\nPlease check the backend connection."
      );
    } finally {
      setIsEmergencyStopping(false);
    }
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-cyber">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Firewall</h1>
                <p className="text-xs text-sidebar-foreground/60">Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Status */}
        {!collapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2 text-success">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium">Firewall Active</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavClass(item.url)}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <button 
              onClick={handleEmergencyStop}
              disabled={isEmergencyStopping}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Power className={`h-4 w-4 ${isEmergencyStopping ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {isEmergencyStopping ? 'Stopping...' : 'Emergency Stop'}
              </span>
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}