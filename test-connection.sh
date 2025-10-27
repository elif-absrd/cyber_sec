#!/bin/bash

echo "=========================================="
echo "🧪 Testing Frontend-Backend Connection"
echo "=========================================="
echo ""

# Check if servers are running
echo "1️⃣  Checking if servers are running..."
BACKEND_RUNNING=$(lsof -i :8000 2>/dev/null | grep LISTEN | wc -l)
FRONTEND_RUNNING=$(lsof -i :8080 2>/dev/null | grep LISTEN | wc -l)

if [ "$BACKEND_RUNNING" -eq 0 ]; then
    echo "❌ Backend is NOT running. Please start it first:"
    echo "   bash /home/kali/cyberProject/cyber_sec/start-all.sh"
    exit 1
fi

if [ "$FRONTEND_RUNNING" -eq 0 ]; then
    echo "❌ Frontend is NOT running. Please start it first:"
    echo "   bash /home/kali/cyberProject/cyber_sec/start-all.sh"
    exit 1
fi

echo "✅ Backend running on port 8000"
echo "✅ Frontend running on port 8080"
echo ""

# Test Backend API
echo "2️⃣  Testing Backend API..."
echo "   GET /api/firewall/status"
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/firewall/status)
if [ "$STATUS_CODE" -eq 200 ]; then
    echo "   ✅ Firewall Status API: HTTP $STATUS_CODE"
else
    echo "   ❌ Firewall Status API: HTTP $STATUS_CODE"
fi
echo ""

# Test CORS
echo "3️⃣  Testing CORS (Cross-Origin Resource Sharing)..."
CORS_TEST=$(curl -s -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:8000/api/firewall/status \
  -I | grep -i "access-control-allow-origin")

if [ -n "$CORS_TEST" ]; then
    echo "   ✅ CORS is properly configured"
    echo "   $CORS_TEST"
else
    echo "   ❌ CORS might not be configured correctly"
fi
echo ""

# Test Service Control
echo "4️⃣  Testing Service Control API..."
echo "   POST /api/firewall/http/on"
RESPONSE=$(curl -s -X POST http://localhost:8000/api/firewall/http/on)
echo "   Response: $RESPONSE"
echo ""

# Test Port Control
echo "5️⃣  Testing Port Control API..."
echo "   POST /api/firewall/port/9999/off"
RESPONSE=$(curl -s -X POST http://localhost:8000/api/firewall/port/9999/off)
echo "   Response: $RESPONSE"
echo ""

# Test Domain Control
echo "6️⃣  Testing Domain Control API..."
echo "   POST /api/firewall/domain/example.com/block"
RESPONSE=$(curl -s -X POST http://localhost:8000/api/firewall/domain/example.com/block)
echo "   Response: $RESPONSE"
echo ""

# Frontend Test
echo "7️⃣  Testing Frontend Availability..."
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/)
if [ "$FRONTEND_CODE" -eq 200 ]; then
    echo "   ✅ Frontend: HTTP $FRONTEND_CODE"
else
    echo "   ❌ Frontend: HTTP $FRONTEND_CODE"
fi
echo ""

echo "=========================================="
echo "✅ Connection Test Complete!"
echo "=========================================="
echo ""
echo "🌐 Access your application:"
echo "   Frontend UI:  http://localhost:8080"
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo ""
echo "📝 Try these actions in the UI:"
echo "   1. Block a domain (e.g., facebook.com)"
echo "   2. Toggle HTTP/HTTPS services"
echo "   3. Block/Allow custom ports"
echo "   4. View real-time firewall rules"
echo ""
