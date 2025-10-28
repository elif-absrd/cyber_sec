import subprocess
import re

class FirewallManager:
    """
    Manages UFW rules for HTTP, HTTPS, DNS, SSH, and custom ports.
    Blocks BOTH inbound and outbound traffic for complete control.
    Handles all edge cases and boundary conditions.
    """
    
    # Valid port range
    MIN_PORT = 1
    MAX_PORT = 65535
    
    # System/privileged ports (require extra caution)
    PRIVILEGED_PORTS = list(range(1, 1024))
    
    # Critical ports that should never be blocked (to prevent lockout)
    PROTECTED_PORTS = {
        22: "SSH - Blocking this will lock you out of remote access!",
        8000: "Backend API - Blocking this will break the firewall app!",
        8080: "Frontend - Blocking this will break the firewall UI!"
    }
    
    # Well-known services mapped to ports
    SERVICE_PORT_MAP = {
        'http': [80, 8080, 8008],
        'https': [443, 8443],
        'ssh': [22],
        'dns': [53],
        'ftp': [21],
        'smtp': [25, 587],
        'mysql': [3306],
        'postgresql': [5432],
        'mongodb': [27017],
        'redis': [6379]
    }

    def run_cmd(self, cmd):
        """Run a shell command and return output or error"""
        try:
            result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            return f"Error: {e.stderr.strip()}"

    def validate_port(self, port):
        """
        Validate port number and return validation result
        Returns: (is_valid, error_message, warning_message)
        """
        # Type check
        if not isinstance(port, int):
            try:
                port = int(port)
            except (ValueError, TypeError):
                return False, f"Invalid port: must be a number between {self.MIN_PORT} and {self.MAX_PORT}", None
        
        # Range check
        if port < self.MIN_PORT or port > self.MAX_PORT:
            return False, f"Invalid port: {port} is out of range. Valid range: {self.MIN_PORT}-{self.MAX_PORT}", None
        
        # Protected port check
        if port in self.PROTECTED_PORTS:
            warning = f"⚠️  WARNING: Port {port} is critical ({self.PROTECTED_PORTS[port]})"
            return True, None, warning
        
        # Privileged port warning
        if port in self.PRIVILEGED_PORTS:
            warning = f"⚠️  Note: Port {port} is a privileged port (requires root)"
            return True, None, warning
        
        return True, None, None

    def validate_service(self, service):
        """
        Validate service name
        Returns: (is_valid, error_message)
        """
        valid_services = ['http', 'https', 'ssh', 'dns', 'ftp', 'smtp']
        
        if not isinstance(service, str):
            return False, "Service must be a string"
        
        service_lower = service.lower().strip()
        
        if service_lower not in valid_services:
            return False, f"Invalid service: {service}. Valid services: {', '.join(valid_services)}"
        
        return True, None

    def validate_protocol(self, proto):
        """
        Validate protocol (tcp/udp)
        Returns: (is_valid, error_message)
        """
        valid_protocols = ['tcp', 'udp', 'any']
        
        if not isinstance(proto, str):
            return False, "Protocol must be a string"
        
        proto_lower = proto.lower().strip()
        
        if proto_lower not in valid_protocols:
            return False, f"Invalid protocol: {proto}. Valid protocols: {', '.join(valid_protocols)}"
        
        return True, None

    def get_existing_rules_for_port(self, port, proto="tcp"):
        """
        Get all existing UFW rules for a specific port
        Returns: list of rule numbers
        """
        try:
            status = self.run_cmd("sudo ufw status numbered")
            pattern = rf"\[\s*(\d+)\].*{port}/{proto}"
            matches = re.findall(pattern, status, re.IGNORECASE)
            return [int(m) for m in matches]
        except Exception:
            return []

    def allow_service(self, service):
        """
        Allow traffic for a service (both inbound and outbound)
        Service names: http, https, ssh, dns, ftp, smtp
        """
        # Validate service
        is_valid, error = self.validate_service(service)
        if not is_valid:
            return f"Error: {error}"
        
        results = []
        # Allow inbound
        results.append(self.run_cmd(f"sudo ufw allow in {service}"))
        # Allow outbound
        results.append(self.run_cmd(f"sudo ufw allow out {service}"))
        return " | ".join(results)

    def deny_service(self, service):
        """
        Deny traffic for a service (both inbound and outbound)
        This ensures complete blocking - can't access external sites on this service
        """
        # Validate service
        is_valid, error = self.validate_service(service)
        if not is_valid:
            return f"Error: {error}"
        
        results = []
        # Deny inbound
        results.append(self.run_cmd(f"sudo ufw deny in {service}"))
        # Deny outbound (this is key - blocks YOU from accessing external sites)
        results.append(self.run_cmd(f"sudo ufw deny out {service}"))
        return " | ".join(results)

    def allow_port(self, port, proto="tcp"):
        """
        Allow a specific port (both inbound and outbound)
        """
        # Validate port
        is_valid, error, warning = self.validate_port(port)
        if not is_valid:
            return f"Error: {error}"
        
        # Validate protocol
        proto_valid, proto_error = self.validate_protocol(proto)
        if not proto_valid:
            return f"Error: {proto_error}"
        
        results = []
        if warning:
            results.append(warning)
        
        results.append(self.run_cmd(f"sudo ufw allow in {port}/{proto}"))
        results.append(self.run_cmd(f"sudo ufw allow out {port}/{proto}"))
        return " | ".join(results)

    def deny_port(self, port, proto="tcp"):
        """
        Deny a specific port (both inbound and outbound)
        """
        # Validate port
        is_valid, error, warning = self.validate_port(port)
        if not is_valid:
            return f"Error: {error}"
        
        # Validate protocol
        proto_valid, proto_error = self.validate_protocol(proto)
        if not proto_valid:
            return f"Error: {proto_error}"
        
        # Extra protection for critical ports
        if port in self.PROTECTED_PORTS:
            return f"Error: Cannot block port {port} - {self.PROTECTED_PORTS[port]}"
        
        results = []
        if warning:
            results.append(warning)
        
        results.append(self.run_cmd(f"sudo ufw deny in {port}/{proto}"))
        results.append(self.run_cmd(f"sudo ufw deny out {port}/{proto}"))
        return " | ".join(results)

    def delete_service_rules(self, service):
        """
        Delete existing rules for a service before adding new ones
        Prevents duplicate rules
        """
        # Validate service first
        is_valid, error = self.validate_service(service)
        if not is_valid:
            return
        
        # Try to delete both in and out rules (ignore errors if they don't exist)
        self.run_cmd(f"sudo ufw delete allow in {service} 2>/dev/null || true")
        self.run_cmd(f"sudo ufw delete deny in {service} 2>/dev/null || true")
        self.run_cmd(f"sudo ufw delete allow out {service} 2>/dev/null || true")
        self.run_cmd(f"sudo ufw delete deny out {service} 2>/dev/null || true")
        # Also try simple form
        self.run_cmd(f"sudo ufw delete allow {service} 2>/dev/null || true")
        self.run_cmd(f"sudo ufw delete deny {service} 2>/dev/null || true")

    def delete_port_rules(self, port, proto="tcp"):
        """
        Delete existing rules for a port before adding new ones
        Handles all edge cases and multiple rule deletions
        """
        # Validate first
        is_valid, error, warning = self.validate_port(port)
        if not is_valid:
            return
        
        proto_valid, proto_error = self.validate_protocol(proto)
        if not proto_valid:
            return
        
        # Delete multiple times to handle duplicates
        max_attempts = 10  # Prevent infinite loop
        for _ in range(max_attempts):
            # Try to delete one rule at a time
            result1 = self.run_cmd(f"sudo ufw delete allow in {port}/{proto} 2>/dev/null || true")
            result2 = self.run_cmd(f"sudo ufw delete deny in {port}/{proto} 2>/dev/null || true")
            result3 = self.run_cmd(f"sudo ufw delete allow out {port}/{proto} 2>/dev/null || true")
            result4 = self.run_cmd(f"sudo ufw delete deny out {port}/{proto} 2>/dev/null || true")
            result5 = self.run_cmd(f"sudo ufw delete allow {port}/{proto} 2>/dev/null || true")
            result6 = self.run_cmd(f"sudo ufw delete deny {port}/{proto} 2>/dev/null || true")
            
            # If all deletions returned empty or error, no more rules to delete
            if all("Could not delete" in r or not r for r in [result1, result2, result3, result4, result5, result6]):
                break

    def service_status(self):
        """Return all firewall rules"""
        return self.run_cmd("sudo ufw status numbered")

    def reset_firewall(self):
        """Reset all rules (use carefully)"""
        return self.run_cmd("sudo ufw --force reset")

    def toggle_service(self, service, action):
        """
        Toggle service on/off with proper rule cleanup and validation
        """
        # Validate inputs
        is_valid, error = self.validate_service(service)
        if not is_valid:
            return f"Error: {error}"
        
        if action not in ["on", "off"]:
            return "Error: Invalid action. Use 'on' or 'off'"
        
        # First, delete any existing rules for this service
        self.delete_service_rules(service)
        
        # Then apply the new rule
        if action == "on":
            return self.allow_service(service)
        else:
            return self.deny_service(service)
    
    def toggle_port(self, port, action, proto="tcp"):
        """
        Toggle port on/off with proper rule cleanup and validation
        Handles all boundary cases
        """
        # Validate port
        is_valid, error, warning = self.validate_port(port)
        if not is_valid:
            return {"success": False, "error": error}
        
        # Validate protocol
        proto_valid, proto_error = self.validate_protocol(proto)
        if not proto_valid:
            return {"success": False, "error": proto_error}
        
        # Validate action
        if action not in ["on", "off"]:
            return {"success": False, "error": "Invalid action. Use 'on' or 'off'"}
        
        # Extra protection for critical ports when blocking
        if action == "off" and port in self.PROTECTED_PORTS:
            return {
                "success": False, 
                "error": f"Cannot block port {port} - {self.PROTECTED_PORTS[port]}"
            }
        
        # First, delete any existing rules for this port
        self.delete_port_rules(port, proto)
        
        # Then apply the new rule
        result = ""
        if action == "on":
            result = self.allow_port(port, proto)
        else:
            result = self.deny_port(port, proto)
        
        return {
            "success": True,
            "result": result,
            "warning": warning,
            "port": port,
            "protocol": proto,
            "action": action
        }
