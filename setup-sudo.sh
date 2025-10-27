#!/bin/bash

echo "=========================================="
echo "🔐 UFW Sudo Permission Setup"
echo "=========================================="
echo ""
echo "To allow the firewall application to control UFW without"
echo "entering a password each time, we need to configure sudo."
echo ""
echo "This script will guide you through the process."
echo ""

# Check if user is root
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Please run this script as a normal user (not root)"
    echo "   The script will ask for sudo when needed."
    exit 1
fi

echo "Current user: $USER"
echo ""

# Backup sudoers file
echo "1️⃣  Creating backup of sudoers file..."
sudo cp /etc/sudoers /etc/sudoers.backup.$(date +%Y%m%d_%H%M%S)
echo "   ✅ Backup created"
echo ""

# Create sudoers rule
echo "2️⃣  Adding UFW permissions for user: $USER"
echo ""
echo "The following line will be added to /etc/sudoers.d/ufw-nopasswd:"
echo ""
echo "   $USER ALL=(ALL) NOPASSWD: /usr/sbin/ufw"
echo ""

# Create the sudoers.d file
SUDOERS_FILE="/etc/sudoers.d/ufw-nopasswd"

echo "# Allow $USER to run UFW commands without password" | sudo tee $SUDOERS_FILE > /dev/null
echo "$USER ALL=(ALL) NOPASSWD: /usr/sbin/ufw" | sudo tee -a $SUDOERS_FILE > /dev/null

# Set correct permissions
sudo chmod 0440 $SUDOERS_FILE

echo "   ✅ Sudoers file created: $SUDOERS_FILE"
echo ""

# Verify the configuration
echo "3️⃣  Verifying configuration..."
if sudo visudo -c -f $SUDOERS_FILE; then
    echo "   ✅ Sudoers configuration is valid"
else
    echo "   ❌ Sudoers configuration has errors"
    echo "   Removing the file..."
    sudo rm $SUDOERS_FILE
    exit 1
fi
echo ""

# Test UFW without password
echo "4️⃣  Testing UFW access..."
if sudo -n ufw status > /dev/null 2>&1; then
    echo "   ✅ UFW can be accessed without password"
else
    echo "   ⚠️  UFW still requires password"
    echo "   You may need to log out and back in for changes to take effect"
fi
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "You can now use the firewall application without entering"
echo "a password for UFW commands."
echo ""
echo "⚠️  SECURITY NOTE:"
echo "   - This allows UFW commands without password"
echo "   - Only the user '$USER' has this permission"
echo "   - Only UFW commands are affected, not other sudo commands"
echo ""
echo "To undo this configuration:"
echo "   sudo rm $SUDOERS_FILE"
echo ""
echo "To restore the original sudoers file:"
echo "   sudo cp /etc/sudoers.backup.* /etc/sudoers"
echo ""
