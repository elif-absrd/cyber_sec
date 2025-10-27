#!/bin/bash

echo "🔍 AI Firewall Management System - Status Check"
echo "================================================"
echo ""

# Check process status
BACKEND_RUNNING=$(lsof -i :8000 2>/dev/null | grep LISTEN | wc -l)
FRONTEND_RUNNING=$(lsof -i :8080 2>/dev/null | grep LISTEN | wc -l)

echo "📊 Process Status:"
echo "=================="
if [ "$BACKEND_RUNNING" -gt 0 ]; then
    echo "✅ Backend:  RUNNING on port 8000"
    BACKEND_PID=$(lsof -ti :8000 2>/dev/null | head -1)
    echo "   PID: $BACKEND_PID"
else
    echo "❌ Backend:  NOT RUNNING"
fi

if [ "$FRONTEND_RUNNING" -gt 0 ]; then
    echo "✅ Frontend: RUNNING on port 8080"
    FRONTEND_PID=$(lsof -ti :8080 2>/dev/null | head -1)
    echo "   PID: $FRONTEND_PID"
else
    echo "❌ Frontend: NOT RUNNING"
fi

echo ""
echo "🌐 Connectivity Tests:"
echo "======================"

# Test backend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ 2>/dev/null | grep -q "200"; then
    echo "✅ Backend API:    http://localhost:8000 (HTTP 200 OK)"
    BACKEND_MSG=$(curl -s http://localhost:8000/ 2>/dev/null | head -c 100)
    echo "   Response: $BACKEND_MSG"
else
    echo "❌ Backend API:    http://localhost:8000 (NOT RESPONDING)"
fi

# Test backend firewall API
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/firewall/status 2>/dev/null | grep -q "200"; then
    echo "✅ Firewall API:   http://localhost:8000/api/firewall/status (HTTP 200 OK)"
else
    echo "❌ Firewall API:   http://localhost:8000/api/firewall/status (NOT RESPONDING)"
fi

# Test frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null | grep -q "200"; then
    echo "✅ Frontend UI:    http://localhost:8080 (HTTP 200 OK)"
else
    echo "❌ Frontend UI:    http://localhost:8080 (NOT RESPONDING)"
fi

echo ""
echo "📝 Important URLs:"
echo "=================="
echo "Frontend:      http://localhost:8080"
echo "Backend API:   http://localhost:8000"
echo "API Docs:      http://localhost:8000/docs"
echo "Redoc:         http://localhost:8000/redoc"

echo ""
echo "📋 Log Files:"
echo "============="
echo "Backend:  /home/kali/cyberProject/cyber_sec/backend.log"
echo "Frontend: /home/kali/cyberProject/cyber_sec/frontend.log"

echo ""
echo "🛠️  Quick Commands:"
echo "==================="
echo "View backend logs:  tail -f /home/kali/cyberProject/cyber_sec/backend.log"
echo "View frontend logs: tail -f /home/kali/cyberProject/cyber_sec/frontend.log"
echo "Restart all:        bash /home/kali/cyberProject/cyber_sec/start-all.sh"
echo "Stop all:           pkill -f 'uvicorn backend.api_server:app' && pkill -f 'vite'"

echo ""
echo "================================================"
date
echo "================================================"
