export interface FirewallRuleResponse {
  rules: string;
}

export interface FirewallActionResponse {
  service?: string;
  port?: number;
  domain?: string;
  action: string;
  result: string;
  ips?: string[];
  results?: string[];
  error?: string;
}

const API_BASE = "http://127.0.0.1:8000/api/firewall";

// Get firewall status
export async function getFirewallStatus(): Promise<FirewallRuleResponse> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error("Failed to fetch firewall status");
  return res.json();
}

// Toggle service (http, https, ssh, etc.)
export async function toggleService(service: string, action: "on" | "off"): Promise<FirewallActionResponse> {
  const res = await fetch(`${API_BASE}/${service}/${action}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to toggle service ${service}`);
  return res.json();
}

// Toggle port (allow/deny)
export async function togglePort(port: number, action: "on" | "off"): Promise<FirewallActionResponse> {
  const res = await fetch(`${API_BASE}/port/${port}/${action}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to toggle port ${port}`);
  return res.json();
}

// Block or unblock a domain
export async function controlDomain(domain: string, action: "block" | "unblock"): Promise<FirewallActionResponse> {
  const res = await fetch(`${API_BASE}/domain/${domain}/${action}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to ${action} domain ${domain}`);
  return res.json();
}
