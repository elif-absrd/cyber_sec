#!/bin/bash

# Test script to verify firewall blocking works correctly
# Tests HTTP, HTTPS, DNS, SSH blocking

echo "🧪 Firewall Blocking Test Script"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Current UFW Status:"
sudo ufw status | head -20
echo ""

echo "================================="
echo "🔬 Test 1: HTTP Blocking (Port 80)"
echo "================================="
echo ""

# Check if HTTP is blocked
if sudo ufw status | grep -q "80.*DENY.*OUT"; then
    echo -e "${GREEN}✅ HTTP outbound is blocked in UFW${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP outbound NOT blocked in UFW${NC}"
fi

# Try to access HTTP site
echo "Testing HTTP access to http://neverssl.com..."
if timeout 3 curl -s --head http://neverssl.com >/dev/null 2>&1; then
    echo -e "${RED}❌ HTTP site is ACCESSIBLE (blocking not working!)${NC}"
else
    echo -e "${GREEN}✅ HTTP site is BLOCKED (working correctly)${NC}"
fi
echo ""

echo "================================="
echo "🔬 Test 2: HTTPS Blocking (Port 443)"
echo "================================="
echo ""

# Check if HTTPS is blocked
if sudo ufw status | grep -q "443.*DENY.*OUT"; then
    echo -e "${GREEN}✅ HTTPS outbound is blocked in UFW${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS outbound NOT blocked in UFW${NC}"
fi

# Try to access HTTPS site
echo "Testing HTTPS access to https://www.google.com..."
if timeout 3 curl -s --head https://www.google.com >/dev/null 2>&1; then
    echo -e "${RED}❌ HTTPS site is ACCESSIBLE (blocking not working!)${NC}"
else
    echo -e "${GREEN}✅ HTTPS site is BLOCKED (working correctly)${NC}"
fi
echo ""

echo "================================="
echo "🔬 Test 3: DNS Blocking (Port 53)"
echo "================================="
echo ""

# Check if DNS is blocked
if sudo ufw status | grep -q "53.*DENY.*OUT"; then
    echo -e "${GREEN}✅ DNS outbound is blocked in UFW${NC}"
else
    echo -e "${YELLOW}⚠️  DNS outbound NOT blocked in UFW${NC}"
fi

# Try DNS lookup
echo "Testing DNS lookup for google.com..."
if timeout 2 nslookup google.com >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  DNS lookup worked (may be using cached results or localhost DNS)${NC}"
else
    echo -e "${GREEN}✅ DNS lookup blocked${NC}"
fi
echo ""

echo "================================="
echo "🔬 Test 4: Localhost Exception"
echo "================================="
echo ""

echo "Testing localhost access (should ALWAYS work)..."
if curl -s http://127.0.0.1:8000/ >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Localhost is accessible (correct - loopback exception)${NC}"
else
    echo -e "${YELLOW}⚠️  Localhost not accessible (backend may not be running)${NC}"
fi
echo ""

echo "================================="
echo "📊 Summary"
echo "================================="
echo ""
echo "Expected behavior when blocking HTTP:"
echo "  ✅ External HTTP sites blocked"
echo "  ✅ Localhost still works (loopback exception)"
echo "  ✅ Both IN and OUT rules present"
echo ""
echo "Run this test after toggling services in the UI to verify blocking works!"
echo ""
