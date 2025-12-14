#!/bin/bash
# Family Dashboard & Todo App Installer for Raspberry Pi
# Run with: curl -sSL https://raw.githubusercontent.com/NicoReplit/family-dashboard/main/install.sh | bash

set -e

echo "================================"
echo "  Family Dashboard Installer"
echo "================================"
echo ""

# Check if running on Raspberry Pi OS
if [ ! -f /etc/rpi-issue ] && [ ! -f /boot/config.txt ]; then
    echo "Warning: This doesn't appear to be a Raspberry Pi, but continuing anyway..."
fi

# Update system
echo "Step 1/5: Updating system..."
sudo apt update

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Step 2/5: Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Step 2/5: Node.js already installed ($(node --version))"
fi

# Create app directory
APP_DIR="/home/$USER/family-dashboard"
echo "Step 3/5: Setting up app directory at $APP_DIR..."

if [ -d "$APP_DIR" ]; then
    echo "Updating existing installation..."
    cd "$APP_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/NicoReplit/family-dashboard.git "$APP_DIR"
    cd "$APP_DIR"
fi

# Install dependencies
echo "Step 4/5: Installing dependencies..."
npm install
cd dashboard
npm install
cd ..

# Create systemd services
echo "Step 5/5: Setting up auto-start services..."

# Todo App service
sudo tee /etc/systemd/system/family-todo.service > /dev/null << EOF
[Unit]
Description=Family Todo App
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run dev:server
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Dashboard service
sudo tee /etc/systemd/system/family-dashboard.service > /dev/null << EOF
[Unit]
Description=Family Dashboard
After=network.target family-todo.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/dashboard
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable family-todo.service
sudo systemctl enable family-dashboard.service
sudo systemctl start family-todo.service
sudo systemctl start family-dashboard.service

# Get IP address
IP_ADDR=$(hostname -I | awk '{print $1}')

echo ""
echo "================================"
echo "  Installation Complete!"
echo "================================"
echo ""
echo "Your Family Dashboard is now running!"
echo ""
echo "Open in your browser: http://$IP_ADDR:5000"
echo ""
echo "Useful commands:"
echo "  Check status:   sudo systemctl status family-dashboard"
echo "  View logs:      sudo journalctl -u family-dashboard -f"
echo "  Restart:        sudo systemctl restart family-dashboard"
echo ""
