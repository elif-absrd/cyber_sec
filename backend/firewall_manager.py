import subprocess

class FirewallManager:
    """
    Manages UFW rules for HTTP, HTTPS, DNS, SSH, and custom ports.
    """

    def run_cmd(self, cmd):
        """Run a shell command and return output or error"""
        try:
            result = subprocess.run(cmd.split(), check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            return f"Error: {e.stderr.strip()}"

    def allow_service(self, service):
        """Allow traffic for a known service"""
        return self.run_cmd(f"sudo ufw allow {service}")

    def deny_service(self, service):
        """Deny traffic for a known service"""
        return self.run_cmd(f"sudo ufw deny {service}")

    def allow_port(self, port, proto="tcp"):
        """Allow a specific port"""
        return self.run_cmd(f"sudo ufw allow {port}/{proto}")

    def deny_port(self, port, proto="tcp"):
        """Deny a specific port"""
        return self.run_cmd(f"sudo ufw deny {port}/{proto}")

    def service_status(self):
        """Return all firewall rules"""
        return self.run_cmd("sudo ufw status numbered")

    def reset_firewall(self):
        """Reset all rules (use carefully)"""
        return self.run_cmd("sudo ufw reset")

    def toggle_service(self, service, action):
        """Generic toggle helper"""
        if action == "on":
            return self.allow_service(service)
        elif action == "off":
            return self.deny_service(service)
        else:
            return "Invalid action: use 'on' or 'off'"
import subprocess
