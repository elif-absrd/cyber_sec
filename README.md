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

## Tech Stack

- **Backend**: FastAPI, Python
- **Frontend**: React, TypeScript, Vite, ShadCN UI
- **Firewall**: UFW (Uncomplicated Firewall)

## Security Note

This application requires sudo privileges to control UFW. The `setup-sudo.sh` script configures passwordless sudo **only** for UFW commands.
