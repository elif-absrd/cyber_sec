#!/bin/bash

# Navigate to project directory and start the backend server
# Binding to 127.0.0.1 (localhost only) for security - not accessible from external network
cd /home/kali/cyberProject/cyber_sec && source /home/kali/cyberProject/cyber_sec/.venv/bin/uvicorn backend.api_server:app --reload --host 127.0.0.1 --port 8000
