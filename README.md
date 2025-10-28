# AI Firewall Management System

Web-based firewall control dashboard for Kali Linux with UFW integration.

## Features

- 🌐 Block/unblock domains (e.g., facebook.com)
- 🔧 Control services (HTTP, HTTPS, SSH, DNS)
- 🔌 Manage ports (allow/deny any port)
- 📊 Real-time firewall status monitoring
- 🎨 Modern React UI with FastAPI backend

## Prerequisites

- Kali Linux (or Debian-based Linux)
- Python 3.8+
- Node.js & npm
- UFW installed
- Sudo privileges

## Setup After Cloning

### Step 1: Install Dependencies

```bash
cd /home/kali/cyberProject/cyber_sec

# Install Python dependencies
pip3 install -r backend/requirements.txt

# Install Frontend dependencies
cd frontend && npm install && cd ..
```

### Step 2: Setup Sudo Permissions

```bash
bash setup-sudo.sh
```

This configures passwordless sudo for UFW commands.

### Step 3: Start the Application

**Terminal 1 - Start Backend:**
```bash
bash start-backend.sh
```

**Terminal 2 - Start Frontend:**
```bash
bash start-frontend.sh
```

### Stop Background Server

```bash
pkill -f "uvicorn backend.api_server:app"
```

### Step 4: Access the Dashboard

Open browser: **http://localhost:8080**

- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Available Scripts

| Script | Purpose |
|--------|---------|
| `setup-sudo.sh` | Configure passwordless sudo for UFW |
| `start-backend.sh` | Start FastAPI backend server |
| `start-frontend.sh` | Start React frontend dev server |
| `status.sh` | Check server status and connectivity |
| `test-connection.sh` | Test frontend-backend connection |

## Usage Examples

### Block a Domain
1. Open http://localhost:8080
2. Enter domain (e.g., `facebook.com`)
3. Click "Block Domain"

### Control Services
- Click service buttons (HTTP, HTTPS, SSH, DNS)
- Green = Enable, Red = Disable

### Manage Ports
- Enter port number (1-65535)
- Click "Allow Port" or "Block Port"

## Troubleshooting

### Servers not running
```bash
bash status.sh
```

### Permission errors
```bash
bash setup-sudo.sh
```

### Connection issues
```bash
bash test-connection.sh
```

### Stop servers
```bash
pkill -f "uvicorn backend.api_server:app" && pkill -f "vite"
```

## Domain Blocking

### How it works:
- **Smart normalization**: Enter `youtube.com` or `www.youtube.com` - both variants are blocked automatically
- **Multi-layer protection**: DNS-level (/etc/hosts) + Firewall-level (UFW) blocking
- **IPv4 + IPv6**: Blocks both protocol versions automatically
- **Bidirectional**: Blocks both IN and OUT traffic
- **Browser cache**: Close and reopen browser after blocking for changes to take effect

### Examples:
- Block `youtube.com` → Blocks both `youtube.com` and `www.youtube.com`
- Block `www.facebook.com` → Blocks both `facebook.com` and `www.facebook.com`
- Works with any domain: `twitter.com`, `reddit.com`, `instagram.com`, etc.

## Service & Port Control

### Improved Blocking Logic:
- **Bidirectional blocking**: Blocks both INBOUND and OUTBOUND traffic
- **Rule cleanup**: Prevents duplicate rules
- **Complete isolation**: When HTTP is blocked, you can't access ANY HTTP sites
- **Localhost exception**: Your local development servers always work

### How it works:
When you disable a service (e.g., HTTP):
1. ✅ Blocks incoming connections (servers can't reach you)
2. ✅ Blocks outgoing connections (you can't reach servers) 
3. ✅ Removes old rules before adding new ones
4. ✅ Localhost (127.0.0.1) always works (loopback exception)

### Available Services:
- **HTTP** (Port 80): Regular web traffic
- **HTTPS** (Port 443): Encrypted web traffic
- **SSH** (Port 22): Remote terminal access
- **DNS** (Port 53): Domain name resolution

### Test Blocking:
```bash
./test-firewall-blocking.sh
```

## Tech Stack

- **Backend**: FastAPI, Python
- **Frontend**: React, TypeScript, Vite, ShadCN UI
- **Firewall**: UFW (Uncomplicated Firewall)

## Documentation

- **[PORT_VALIDATION.md](PORT_VALIDATION.md)** - Comprehensive port validation rules and boundary cases
- **[PORT_LOGIC_SUMMARY.md](PORT_LOGIC_SUMMARY.md)** - Complete rework summary with test results

## Testing

Run comprehensive boundary case tests:

```bash
# Basic port validation test
./test-port-validation.sh

# Complete integration test (19 test cases)
./test-integration.sh

# Firewall blocking test
./test-firewall-blocking.sh
```

All tests should pass with 100% success rate.

## Security Note

This application requires sudo privileges to control UFW. The `setup-sudo.sh` script configures passwordless sudo **only** for UFW commands.

### Protected Ports
The following ports **cannot be blocked** to prevent system lockout:
- **Port 22** (SSH) - Remote access
- **Port 8000** (Backend API) - Application backend
- **Port 8080** (Frontend) - Application UI

### Port Validation
- Valid range: **1-65535**
- Ports 1-1023 show warnings (privileged ports)
- Complete validation prevents all boundary case failures

## Troubleshooting

### Permission errors
```bash
bash setup-sudo.sh
```

### Connection issues
```bash
bash test-connection.sh
```

### Stop servers
```bash
pkill -f "uvicorn backend.api_server:app" && pkill -f "vite"
```
