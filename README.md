# AI Firewall Management System - Kali Linux

A comprehensive firewall management system with a FastAPI backend for controlling UFW (Uncomplicated Firewall) on Kali Linux.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

This project provides a web-based interface to manage UFW firewall rules on Kali Linux. It includes:
- **Backend**: FastAPI server for firewall management
- **Frontend**: (To be implemented) Web interface for firewall control

## ✨ Features

- ✅ Control firewall services (HTTP, HTTPS, SSH, DNS)
- ✅ Manage custom ports (allow/deny)
- ✅ Domain-based blocking (resolves domain to IP and blocks)
- ✅ View current firewall status
- ✅ RESTful API for automation

## 📦 Prerequisites

- **Operating System**: Kali Linux (or any Debian-based Linux with UFW)
- **Python**: 3.8 or higher
- **UFW**: Uncomplicated Firewall
- **Sudo privileges**: Required for firewall management

## 🚀 Installation

### Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install UFW (if not already installed)

```bash
sudo apt install ufw -y
```

### Step 3: Enable UFW

```bash
sudo ufw enable
sudo ufw status
```

### Step 4: Install Python Dependencies

Navigate to the project directory:

```bash
cd /home/kali/cyberProject/cyber_sec
```

Install Python packages:

```bash
pip3 install -r backend/requirements.txt
```

Or install manually:

```bash
pip3 install fastapi uvicorn
```

### Step 5: Configure Sudo Permissions (Important!)

To allow the application to run UFW commands without password prompts, add the following to sudoers:

```bash
sudo visudo
```

Add this line at the end (replace `kali` with your username if different):

```
kali ALL=(ALL) NOPASSWD: /usr/sbin/ufw
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

## ⚙️ Configuration

### Backend Configuration

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

To modify CORS settings, edit `backend/api_server.py`:

```python
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your frontend URL here
]
```

## 🏃 Running the Application

### Start the Backend Server

From the project root directory:

```bash
cd /home/kali/cyberProject/cyber_sec
uvicorn backend.api_server:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Run in Background (Production Mode)

```bash
nohup uvicorn backend.api_server:app --host 0.0.0.0 --port 8000 &
```

### Stop Background Server

```bash
pkill -f "uvicorn backend.api_server:app"
```

## 📡 API Endpoints

### 1. Get Firewall Status

```bash
curl http://localhost:8000/api/firewall/status
```

### 2. Control Services

**Enable HTTP:**
```bash
curl -X POST http://localhost:8000/api/firewall/http/on
```

**Disable HTTPS:**
```bash
curl -X POST http://localhost:8000/api/firewall/https/off
```

**Services available:** `http`, `https`, `ssh`, `dns`, `ftp`

### 3. Control Ports

**Allow port 8080:**
```bash
curl -X POST http://localhost:8000/api/firewall/port/8080/on
```

**Deny port 22:**
```bash
curl -X POST http://localhost:8000/api/firewall/port/22/off
```

### 4. Domain Blocking

**Block a domain:**
```bash
curl -X POST http://localhost:8000/api/firewall/domain/example.com/block
```

**Unblock a domain:**
```bash
curl -X POST http://localhost:8000/api/firewall/domain/example.com/unblock
```

## 🐛 Troubleshooting

### Issue: "Permission denied" errors

**Solution**: Ensure you've configured sudo permissions (see Step 5 in Installation).

### Issue: UFW not installed

```bash
sudo apt install ufw -y
sudo systemctl enable ufw
sudo systemctl start ufw
```

### Issue: Port 8000 already in use

**Find and kill the process:**
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

Or use a different port:
```bash
uvicorn backend.api_server:app --reload --port 8001
```

### Issue: Module not found

```bash
cd /home/kali/cyberProject/cyber_sec
pip3 install --upgrade -r backend/requirements.txt
```

### Check UFW Status Manually

```bash
sudo ufw status numbered
sudo ufw status verbose
```

## 🔒 Security Considerations

1. **Sudo Access**: The application requires sudo privileges. Use with caution.
2. **CORS**: Update CORS origins for production environments.
3. **Authentication**: Consider adding authentication for production use.
4. **Firewall Rules**: Test rules carefully to avoid locking yourself out.

## 📝 Development

### Install Development Dependencies

```bash
pip3 install pytest httpx
```

### Run in Development Mode

```bash
uvicorn backend.api_server:app --reload --log-level debug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is provided as-is for educational and security research purposes.

## 🙋 Support

For issues and questions:
- Check the API documentation at http://localhost:8000/docs
- Review UFW logs: `sudo tail -f /var/log/ufw.log`
- Check system logs: `journalctl -xe`

---

**⚠️ Warning**: This application modifies system firewall rules. Always test in a safe environment before using in production.
