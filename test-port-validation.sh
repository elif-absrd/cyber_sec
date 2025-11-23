#!/bin/bash

# Test script for port validation boundary cases
# Tests all edge cases to ensure comprehensive validation

API_URL="http://localhost:8000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================="
echo "Port Validation Boundary Test"
echo "=================================="
echo ""

# Function to test port blocking with expected outcome
test_port() {
    local port=$1
    local action=$2
    local should_succeed=$3
    local test_name=$4
    
    echo -n "Testing: $test_name (port=$port, action=$action)... "
    
    response=$(curl -s -X POST "$API_URL/api/firewall/port/$port/$action" 2>&1)
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/firewall/port/$port/$action" 2>&1)
    
    if [ "$should_succeed" = "yes" ]; then
        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✓ PASS${NC}"
            echo "  Response: $response"
        else
            echo -e "${RED}✗ FAIL${NC} (Expected success, got HTTP $http_code)"
            echo "  Response: $response"
        fi
    else
        if [ "$http_code" = "400" ]; then
            echo -e "${GREEN}✓ PASS${NC} (Correctly rejected)"
            echo "  Response: $response"
        else
            echo -e "${RED}✗ FAIL${NC} (Expected 400 error, got HTTP $http_code)"
            echo "  Response: $response"
        fi
    fi
    echo ""
}

echo "=== Testing Invalid Port Ranges ==="
test_port 0 "off" "no" "Port 0 (below minimum)"
test_port -1 "off" "no" "Negative port"
test_port 65536 "off" "no" "Port above maximum (65536)"
test_port 99999 "off" "no" "Very large port number"

echo ""
echo "=== Testing Protected Critical Ports ==="
test_port 22 "off" "no" "SSH port 22 (should be protected)"
test_port 8000 "off" "no" "Backend API port 8000 (should be protected)"
test_port 8080 "off" "no" "Frontend port 8080 (should be protected)"

echo ""
echo "=== Testing Valid Ports ==="
test_port 3000 "off" "yes" "Valid port 3000 blocking"
test_port 3000 "on" "yes" "Valid port 3000 unblocking"
test_port 9999 "off" "yes" "Valid high port 9999"
test_port 1 "off" "yes" "Minimum valid port 1"
test_port 65535 "off" "yes" "Maximum valid port 65535"

echo ""
echo "=== Testing Privileged Ports (Should warn but allow) ==="
test_port 80 "off" "yes" "HTTP port 80 (privileged)"
test_port 443 "off" "yes" "HTTPS port 443 (privileged)"   
test_port 21 "off" "yes" "FTP port 21 (privileged)"

echo ""
echo "=== Testing Invalid Actions ==="
# Note: FastAPI will reject invalid actions before reaching our code
echo "Testing invalid action 'invalid' on port 1234..."
response=$(curl -s -X POST "$API_URL/api/firewall/port/1234/invalid" 2>&1)
echo "Response: $response"
echo ""

echo "=================================="
echo "Test Complete!"
echo "=================================="
echo ""
echo "Expected Results:"
echo "  - Ports 0, -1, 65536, 99999: REJECTED (out of range)"
echo "  - Ports 22, 8000, 8080: REJECTED (critical/protected)"
echo "  - Ports 1, 80, 443, 3000, 9999, 65535: ACCEPTED"
echo "  - Privileged ports (1-1023): May show warnings but accepted"
echo ""
echo "Check firewall status:"
echo "  sudo ufw status numbered"
echo ""
echo "Clean up test rules:"
echo "  sudo ufw delete allow 3000"
echo "  sudo ufw delete allow 9999"
echo "  etc..."
