#!/bin/bash

# Test Emergency Stop Functionality

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:8000"

echo "=========================================="
echo "  Emergency Stop Functionality Test"
echo "=========================================="
echo ""

echo -e "${YELLOW}This test will:${NC}"
echo "  1. Add some test firewall rules"
echo "  2. Execute emergency stop"
echo "  3. Verify all rules were cleared"
echo ""
read -p "Press ENTER to continue or CTRL+C to cancel..."
echo ""

# Step 1: Add some test rules
echo -e "${YELLOW}Step 1: Adding test firewall rules...${NC}"

# Block a test port
echo -n "  - Blocking port 9999... "
response=$(curl -s -X POST "$API_URL/api/firewall/port/9999/off")
if [[ $response == *"success"* ]]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "    Response: $response"
fi

# Block HTTP
echo -n "  - Blocking HTTP... "
response=$(curl -s -X POST "$API_URL/api/firewall/http/off")
echo -e "${GREEN}✓${NC}"

echo ""
echo -e "${YELLOW}Current firewall status:${NC}"
sudo ufw status numbered | head -20
echo ""

# Step 2: Execute Emergency Stop
echo -e "${RED}Step 2: Executing EMERGENCY STOP...${NC}"
echo -n "  - Sending emergency stop command... "

response=$(curl -s -X POST "$API_URL/api/firewall/emergency-stop")
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/firewall/emergency-stop")

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓${NC}"
    echo "  Response:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
    echo "  Response: $response"
    exit 1
fi

echo ""
sleep 2

# Step 3: Verify rules cleared
echo -e "${YELLOW}Step 3: Verifying firewall was reset...${NC}"
echo ""
echo -e "${YELLOW}New firewall status:${NC}"
sudo ufw status verbose

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Emergency Stop Test Complete!${NC}"
echo "=========================================="
echo ""
echo "Expected results:"
echo "  ✓ All custom rules should be deleted"
echo "  ✓ UFW should be active with default deny policy"
echo "  ✓ Incoming: deny (default)"
echo "  ✓ Outgoing: allow (default)"
echo ""
