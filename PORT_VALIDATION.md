# Port Control Validation - Comprehensive Documentation

## Overview
This document explains all boundary cases and validation logic implemented in the port control system to prevent lockouts, system damage, and invalid operations.

## Port Range Validation

### Valid Range: 1-65535

| Port Number | Status | Reason |
|------------|--------|---------|
| 0 | ❌ REJECTED | Reserved/invalid |
| -1 (negative) | ❌ REJECTED | Invalid number |
| 1 | ✅ ACCEPTED | Minimum valid port (with warning) |
| 65535 | ✅ ACCEPTED | Maximum valid port |
| 65536 | ❌ REJECTED | Above maximum |
| 99999 | ❌ REJECTED | Out of range |

**Error Message**: `"Invalid port: {port} is out of range. Valid range: 1-65535"`

## Protected Critical Ports

These ports **cannot be blocked** to prevent system lockout or app breakage:

| Port | Service | Protection Reason |
|------|---------|-------------------|
| 22 | SSH | Blocking SSH will lock you out of remote access |
| 8000 | Backend API | Blocking this will break the firewall management app |
| 8080 | Frontend UI | Blocking this will break the firewall web interface |

**Error Message**: `"Cannot block port {port} - {service_description}"`

**Frontend Protection**: Shows confirmation dialog + prevents backend call

## Privileged Ports (1-1023)

System/well-known ports that require special attention:

| Port Range | Category | Behavior |
|------------|----------|----------|
| 1-1023 | Privileged ports | ⚠️ Shows warning but allows |
| 80 | HTTP | Warning: "Port 80 is a privileged port (requires root)" |
| 443 | HTTPS | Warning: "Port 443 is a privileged port (requires root)" |
| 21 | FTP | Warning: "Port 21 is a privileged port (requires root)" |
| 53 | DNS | Warning shown |
| 25 | SMTP | Warning shown |

**Warning Message**: `"⚠️  Note: Port {port} is a privileged port (requires root)"`

**Frontend Protection**: Shows confirmation dialog before blocking privileged ports

## Protocol Validation

Valid protocols for port blocking:

| Protocol | Status | Description |
|----------|--------|-------------|
| `tcp` | ✅ Valid | Default protocol |
| `udp` | ✅ Valid | User Datagram Protocol |
| `any` | ✅ Valid | Both TCP and UDP |
| Other | ❌ Invalid | Rejected |

**Error Message**: `"Invalid protocol: {proto}. Valid protocols: tcp, udp, any"`

## Action Validation

Valid actions for port control:

| Action | Status | Description |
|--------|--------|-------------|
| `on` | ✅ Valid | Allow traffic on port |
| `off` | ✅ Valid | Block traffic on port |
| Other | ❌ Invalid | Rejected |

**Error Message**: `"Invalid action. Use 'on' or 'off'"`

## Validation Flow

```
User Input → Frontend Validation → Backend Validation → UFW Command
                ↓                        ↓                    ↓
         Client-side checks      Comprehensive checks    Firewall rules
         - Range (1-65535)       - Range validation      - IN + OUT rules
         - Confirmation dialogs  - Protected ports       - IPv4 + IPv6
                                 - Protocol check
                                 - Action check
```

## Boundary Cases Handled

### 1. **Out of Range Ports**
```bash
# Test cases
POST /api/firewall/port/0/off      → 400 Error
POST /api/firewall/port/-1/off     → 400 Error  
POST /api/firewall/port/65536/off  → 400 Error
POST /api/firewall/port/99999/off  → 400 Error
```

### 2. **Protected Critical Ports**
```bash
# Backend API protection
POST /api/firewall/port/8000/off   → 400 Error: "Cannot block port 8000"

# Frontend protection
POST /api/firewall/port/8080/off   → 400 Error: "Cannot block port 8080"

# SSH protection
POST /api/firewall/port/22/off     → 400 Error: "Cannot block port 22"
```

### 3. **Edge Values**
```bash
# Minimum valid port
POST /api/firewall/port/1/off      → 200 Success (with warning)

# Maximum valid port
POST /api/firewall/port/65535/off  → 200 Success
```

### 4. **Privileged Ports**
```bash
# HTTP
POST /api/firewall/port/80/off     → 200 Success (with warning)

# HTTPS
POST /api/firewall/port/443/off    → 200 Success (with warning)

# FTP
POST /api/firewall/port/21/off     → 200 Success (with warning)
```

### 5. **Invalid Actions**
```bash
POST /api/firewall/port/1234/invalid  → 400 Error: "Invalid action"
POST /api/firewall/port/1234/block    → 400 Error: "Invalid action"
```

### 6. **Type Coercion**
```bash
# FastAPI handles type conversion
POST /api/firewall/port/abc/off    → 422 Validation Error (FastAPI)
POST /api/firewall/port/3.14/off   → Converts to int(3) → validated
```

## Response Format

### Success Response
```json
{
  "success": true,
  "result": "Rule added\nRule added (v6) | Rule added\nRule added (v6)",
  "warning": "⚠️  Note: Port 80 is a privileged port (requires root)",
  "port": 80,
  "protocol": "tcp",
  "action": "off"
}
```

### Error Response (400)
```json
{
  "detail": "Invalid port: 65536 is out of range. Valid range: 1-65535"
}
```

### Protected Port Error (400)
```json
{
  "detail": "Cannot block port 22 - SSH - Blocking this will lock you out of remote access!"
}
```

## Testing

Run comprehensive boundary case tests:

```bash
./test-port-validation.sh
```

This tests:
- ✅ Invalid ranges (0, -1, 65536, 99999)
- ✅ Protected ports (22, 8000, 8080)
- ✅ Valid ports (1, 3000, 9999, 65535)
- ✅ Privileged ports (21, 80, 443)
- ✅ Invalid actions

## Implementation Details

### Backend (`firewall_manager.py`)
```python
class FirewallManager:
    MIN_PORT = 1
    MAX_PORT = 65535
    PRIVILEGED_PORTS = list(range(1, 1024))
    PROTECTED_PORTS = {22, 8000, 8080}
    
    def validate_port(self, port):
        # Returns: (is_valid, error_message, warning_message)
        
    def toggle_port(self, port, action, proto="tcp"):
        # Returns: dict with success, error, warning, result
```

### Frontend (`FirewallDashboard.tsx`)
```typescript
const handleCustomPort = async (action: "on" | "off") => {
  // 1. Basic range validation (1-65535)
  // 2. Confirmation for critical ports (22, 8000, 8080)
  // 3. Confirmation for privileged ports (1-1023)
  // 4. API call with error handling
}
```

### API Endpoint (`api_server.py`)
```python
@app.post("/api/firewall/port/{port}/{action}")
def control_port(port: int, action: str):
    result = fw.toggle_port(port, action)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result
```

## Security Considerations

1. **Double Validation**: Both frontend and backend validate to prevent bypassing client-side checks
2. **Protected Ports**: Hard-coded list prevents accidental self-lockout
3. **Privileged Port Warnings**: Alerts users about system-critical ports
4. **Bidirectional Blocking**: Both IN and OUT rules for complete control
5. **Rule Cleanup**: Deletes old rules before adding new ones to prevent duplicates

## Known Limitations

1. **FastAPI Type Coercion**: Decimals like `3.14` are converted to `int(3)` before validation
2. **No Port Conflict Detection**: Doesn't check if a service is currently using the port
3. **No Service Name Resolution**: Can't automatically detect service names for ports
4. **Localhost Exception**: Loopback interface bypasses all firewall rules (by design)

## Future Enhancements

- [ ] Port scanning to detect active services before blocking
- [ ] Custom protected port list per user
- [ ] Port history tracking (recently blocked ports)
- [ ] Bulk port operations (block range 8000-9000)
- [ ] Protocol auto-detection (TCP vs UDP vs both)
- [ ] Integration with `/etc/services` for port name resolution
