from fastapi import APIRouter
import subprocess
import socket
import re

router = APIRouter(prefix="/api/firewall/domain", tags=["Domain Rules"])

def run_cmd(cmd: str):
    """Execute shell command and return output"""
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.stdout.strip() + result.stderr.strip()

def normalize_domain(domain: str) -> tuple:
    """
    Normalize domain to get both www and non-www variants.
    Returns: (base_domain, www_domain)
    Examples:
        'youtube.com' -> ('youtube.com', 'www.youtube.com')
        'www.youtube.com' -> ('youtube.com', 'www.youtube.com')
        'mail.google.com' -> ('mail.google.com', 'www.mail.google.com')
    """
    domain = domain.strip().lower()
    
    # Remove www. prefix if present
    if domain.startswith('www.'):
        base_domain = domain[4:]
        www_domain = domain
    else:
        base_domain = domain
        www_domain = f"www.{domain}"
    
    return base_domain, www_domain

def get_all_ips_for_domain(domain: str) -> tuple:
    """
    Resolve domain to all IPv4 and IPv6 addresses.
    Returns: (list[ipv4], list[ipv6])
    """
    ipv4_addresses = []
    ipv6_addresses = []
    
    try:
        # Get IPv4 addresses
        ipv4_info = socket.getaddrinfo(domain, None, socket.AF_INET)
        ipv4_addresses = list(set([addr[4][0] for addr in ipv4_info]))
    except Exception:
        pass
    
    try:
        # Get IPv6 addresses
        ipv6_info = socket.getaddrinfo(domain, None, socket.AF_INET6)
        ipv6_addresses = list(set([addr[4][0] for addr in ipv6_info]))
    except Exception:
        pass
    
    return ipv4_addresses, ipv6_addresses

def get_blocked_domains() -> set:
    """Get list of currently blocked domains from /etc/hosts"""
    blocked = set()
    try:
        with open('/etc/hosts', 'r') as f:
            for line in f:
                if line.strip().startswith('0.0.0.0'):
                    parts = line.strip().split()
                    if len(parts) >= 2:
                        blocked.add(parts[1])
    except Exception:
        pass
    return blocked

def add_to_hosts(domains: list):
    """Add domains to /etc/hosts with 0.0.0.0"""
    existing = get_blocked_domains()
    to_add = [d for d in domains if d not in existing]
    
    if not to_add:
        return f"Domains already in /etc/hosts"
    
    entries = "\n".join([f"0.0.0.0 {d}" for d in to_add]) + "\n"
    cmd = f"echo '{entries}' | sudo tee -a /etc/hosts > /dev/null"
    run_cmd(cmd)
    return f"Added {len(to_add)} domain(s) to /etc/hosts"

def remove_from_hosts(domains: list):
    """Remove domains from /etc/hosts"""
    results = []
    for domain in domains:
        cmd = f"sudo sed -i '/^0.0.0.0.*{re.escape(domain)}$/d' /etc/hosts"
        run_cmd(cmd)
        results.append(f"Removed {domain}")
    return ", ".join(results)

def block_ips_in_firewall(ips: list, domain: str):
    """Block list of IPs in UFW firewall"""
    results = []
    localhost_ips = {'127.0.0.1', '0.0.0.0', '::1', '::'}
    
    for ip in ips:
        if ip in localhost_ips:
            continue
        
        # Block outbound
        out_result = run_cmd(f"sudo ufw deny out to {ip} comment 'Blocked {domain}'")
        if "Rule added" in out_result or "existing" in out_result.lower():
            results.append(f"OUT: {ip}")
        
        # Block inbound
        in_result = run_cmd(f"sudo ufw deny in from {ip} comment 'Blocked {domain}'")
        if "Rule added" in in_result or "existing" in in_result.lower():
            results.append(f"IN: {ip}")
    
    return results

def unblock_ips_from_firewall(ips: list):
    """Remove IP blocking rules from UFW firewall"""
    results = []
    localhost_ips = {'127.0.0.1', '0.0.0.0', '::1', '::'}
    
    for ip in ips:
        if ip in localhost_ips:
            continue
        
        # Try to delete rules (ignore errors if rule doesn't exist)
        run_cmd(f"sudo ufw delete deny out to {ip} 2>/dev/null")
        run_cmd(f"sudo ufw delete deny in from {ip} 2>/dev/null")
        results.append(ip)
    
    return results

def flush_dns_cache():
    """Flush system DNS cache"""
    run_cmd("sudo systemd-resolve --flush-caches 2>/dev/null || sudo resolvectl flush-caches 2>/dev/null || true")
    return "DNS cache flushed"

@router.post("/{domain}/{action}")
def manage_domain(domain: str, action: str):
    """
    Block or unblock a domain (works with both www.xyz.com and xyz.com).
    Automatically handles both variants regardless of what user enters.
    """
    try:
        # Normalize domain to get both variants
        base_domain, www_domain = normalize_domain(domain)
        all_domains = [base_domain, www_domain]
        
        # Get IPs for both variants
        base_ipv4, base_ipv6 = get_all_ips_for_domain(base_domain)
        www_ipv4, www_ipv6 = get_all_ips_for_domain(www_domain)
        
        # Combine and deduplicate IPs
        all_ipv4 = list(set(base_ipv4 + www_ipv4))
        all_ipv6 = list(set(base_ipv6 + www_ipv6))
        all_ips = all_ipv4 + all_ipv6
        
        results = []
        
        if action.lower() == "block":
            # 1. Add to /etc/hosts (DNS level blocking)
            hosts_result = add_to_hosts(all_domains)
            results.append(hosts_result)
            
            # 2. Block IPs in firewall
            firewall_results = block_ips_in_firewall(all_ips, base_domain)
            results.extend(firewall_results)
            
            # 3. Flush DNS cache
            flush_result = flush_dns_cache()
            results.append(flush_result)
            
            return {
                "status": "success",
                "action": "blocked",
                "domains_blocked": all_domains,
                "ipv4_addresses": all_ipv4,
                "ipv6_addresses": all_ipv6,
                "total_ips": len(all_ips),
                "total_rules": len(firewall_results),
                "message": f"Blocked {base_domain} and {www_domain} ({len(all_ips)} IPs)"
            }
            
        elif action.lower() == "unblock":
            # 1. Remove from /etc/hosts
            hosts_result = remove_from_hosts(all_domains)
            results.append(hosts_result)
            
            # 2. Unblock IPs from firewall
            firewall_results = unblock_ips_from_firewall(all_ips)
            results.extend(firewall_results)
            
            # 3. Flush DNS cache
            flush_result = flush_dns_cache()
            results.append(flush_result)
            
            return {
                "status": "success",
                "action": "unblocked",
                "domains_unblocked": all_domains,
                "ipv4_addresses": all_ipv4,
                "ipv6_addresses": all_ipv6,
                "total_ips": len(all_ips),
                "message": f"Unblocked {base_domain} and {www_domain} ({len(all_ips)} IPs)"
            }
        else:
            return {
                "status": "error",
                "message": "Invalid action. Use 'block' or 'unblock'."
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@router.get("/blocked")
def list_blocked_domains():
    """Get list of all currently blocked domains"""
    try:
        blocked = sorted(list(get_blocked_domains()))
        return {
            "status": "success",
            "blocked_domains": blocked,
            "total": len(blocked)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

