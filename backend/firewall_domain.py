from fastapi import APIRouter
import subprocess
import socket

router = APIRouter(prefix="/api/firewall/domain", tags=["Domain Rules"])

def run_cmd(cmd: str):
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.stdout.strip() + result.stderr.strip()

@router.post("/{domain}/{action}")
def manage_domain(domain: str, action: str):
    try:
        # Resolve domain to IPs
        ips = list(set(socket.gethostbyname_ex(domain)[2]))
        results = []

        for ip in ips:
            if action.lower() == "block":
                results.append(run_cmd(f"sudo ufw deny out to {ip} comment 'Blocked {domain}'"))
                results.append(run_cmd(f"sudo ufw deny in from {ip} comment 'Blocked {domain}'"))
            elif action.lower() == "unblock":
                results.append(run_cmd(f"sudo ufw delete deny out to {ip}"))
                results.append(run_cmd(f"sudo ufw delete deny in from {ip}"))
            else:
                return {"error": "Invalid action. Use 'block' or 'unblock'."}
        return {"domain": domain, "ips": ips, "action": action, "results": results}
    except Exception as e:
        return {"error": str(e)}

