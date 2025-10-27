export interface FirewallRuleResponse {
  rules: string;
}

export interface FirewallActionResponse {
  service?: string;
  port?: number;
  action: string;
  result: string;
}

const API_BASE = "http://127.0.0.1:8000/api/firewall";

export async function getFirewallStatus(): Promise<FirewallRuleResponse> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error("Failed to fetch firewall status");
  return res.json();
}

export async function toggleService(service: string, action: "on" | "off"): Promise<FirewallActionResponse> {
  const res = await fetch(`${API_BASE}/${service}/${action}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to toggle service ${service}`);
  return res.json();
}

export async function togglePort(port: number, action: "on" | "off"): Promise<FirewallActionResponse> {
  const res = await fetch(`${API_BASE}/port/${port}/${action}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to toggle port ${port}`);
  return res.json();
}
