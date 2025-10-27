#!/bin/bash

# Navigate to project directory and start the backend server
cd /home/kali/cyberProject/cyber_sec && /home/kali/cyberProject/cyber_sec/.venv/bin/uvicorn backend.api_server:app --reload --host 0.0.0.0 --port 8000
