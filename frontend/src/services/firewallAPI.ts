export interface FirewallRuleResponse {
  rules: string;
}

export interface FirewallActionResponse {
  service?: string;
  port?: number;
  domain?: string;
  action?: string;
  result?: string;
  ips?: string[];
  results?: string[];
  error?: string;
  status?: string;
  message?: string;
  domains_blocked?: string[];
  domains_unblocked?: string[];
  ipv4_addresses?: string[];
  ipv6_addresses?: string[];
  total_ips?: number;
  total_rules?: number;
  success?: boolean;
  warning?: string;
  protocol?: string;
}

export interface BlockedDomainsResponse {
  status: string;
  blocked_domains: string[];
  total: number;
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
  
  // Handle validation errors (400 status)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: `Failed to toggle port ${port}` }));
    const error = new Error(errorData.detail || `Failed to toggle port ${port}`);
    (error as any).response = { data: errorData };
    throw error;
  }
  
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

// Get list of blocked domains
export async function getBlockedDomains(): Promise<BlockedDomainsResponse> {
  const res = await fetch(`${API_BASE}/domain/blocked`);
  if (!res.ok) throw new Error("Failed to fetch blocked domains");
  return res.json();
}
