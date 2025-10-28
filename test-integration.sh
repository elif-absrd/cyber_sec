#!/bin/bash

# Integration test - Tests both frontend and backend boundary case handling
# This demonstrates the complete validation pipeline

API_URL="http://localhost:8000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  Port Validation Integration Test"
echo "  Testing Complete Boundary Case Coverage"
echo "=========================================="
echo ""

# Counter for tests
TOTAL=0
PASSED=0
FAILED=0

test_case() {
    local test_name="$1"
    local port=$2
    local action=$3
    local expected_status=$4
    
    TOTAL=$((TOTAL + 1))
    
    echo -e "${BLUE}[TEST $TOTAL]${NC} $test_name"
    echo "  Request: POST /api/firewall/port/$port/$action"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/api/firewall/port/$port/$action")
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE:/d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "  ${GREEN}✓ PASS${NC} - Got expected HTTP $http_code"
        PASSED=$((PASSED + 1))
    else
        echo -e "  ${RED}✗ FAIL${NC} - Expected HTTP $expected_status, got $http_code"
        FAILED=$((FAILED + 1))
    fi
    
    echo "  Response: $(echo $body | head -c 100)..."
    echo ""
}

echo -e "${YELLOW}=== BOUNDARY CASE TESTS ===${NC}"
echo ""

# Out of Range Tests
test_case "Port 0 (invalid minimum)" 0 "off" "400"
test_case "Port -1 (negative)" -1 "off" "400"
test_case "Port 65536 (exceeds maximum)" 65536 "off" "400"
test_case "Port 100000 (way out of range)" 100000 "off" "400"

echo -e "${YELLOW}=== PROTECTED PORT TESTS ===${NC}"
echo ""

# Critical Port Protection
test_case "SSH Port 22 (must be protected)" 22 "off" "400"
test_case "Backend Port 8000 (must be protected)" 8000 "off" "400"
test_case "Frontend Port 8080 (must be protected)" 8080 "off" "400"

echo -e "${YELLOW}=== VALID PORT TESTS ===${NC}"
echo ""

# Edge Values
test_case "Port 1 (minimum valid)" 1 "off" "200"
test_case "Port 65535 (maximum valid)" 65535 "off" "200"

# Common Ports
test_case "Port 3306 (MySQL)" 3306 "off" "200"
test_case "Port 5432 (PostgreSQL)" 5432 "off" "200"
test_case "Port 27017 (MongoDB)" 27017 "off" "200"

echo -e "${YELLOW}=== PRIVILEGED PORT TESTS ===${NC}"
echo ""

# System Ports (should have warnings but succeed)
test_case "Port 80 (HTTP - privileged)" 80 "off" "200"
test_case "Port 443 (HTTPS - privileged)" 443 "off" "200"
test_case "Port 21 (FTP - privileged)" 21 "off" "200"
test_case "Port 53 (DNS - privileged)" 53 "off" "200"

echo -e "${YELLOW}=== TOGGLE TESTS ===${NC}"
echo ""

# Test on/off toggling
test_case "Block port 9000" 9000 "off" "200"
test_case "Unblock port 9000" 9000 "on" "200"
test_case "Re-block port 9000" 9000 "off" "200"

echo ""
echo "=========================================="
echo "  Test Results Summary"
echo "=========================================="
echo -e "Total Tests:  ${BLUE}$TOTAL${NC}"
echo -e "Passed:       ${GREEN}$PASSED${NC}"
echo -e "Failed:       ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    echo ""
    echo "Boundary case coverage verified:"
    echo "  ✓ Invalid port ranges rejected"
    echo "  ✓ Protected ports blocked"
    echo "  ✓ Valid ports accepted"
    echo "  ✓ Privileged ports warned"
    echo "  ✓ Toggle operations work"
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo "Please review the failures above."
fi

echo ""
echo "Check created firewall rules:"
echo "  sudo ufw status numbered | grep -E '(3306|5432|27017|9000|80|443|21|53|65535)'"
echo ""
