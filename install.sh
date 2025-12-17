#!/bin/bash
# Family Dashboard & Todo App Installer for Raspberry Pi
# Run with: curl -sSL https://raw.githubusercontent.com/NicoReplit/DUMDIDO-TODO-v.1.2/main/install.sh | bash

set -e

echo "================================"
echo "  Family Dashboard Installer"
echo "================================"
echo ""

# Check if running on Raspberry Pi OS
if [ ! -f /etc/rpi-issue ] && [ ! -f /boot/config.txt ]; then
    echo "Warning: This doesn't appear to be a Raspberry Pi, but continuing anyway..."
fi

# Get the current user (for systemd services)
CURRENT_USER=${SUDO_USER:-$USER}
APP_DIR="/home/$CURRENT_USER/family-dashboard"

# Update system
echo "Step 1/7: Updating system..."
sudo apt update

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Step 2/7: Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Step 2/7: Node.js already installed ($(node --version))"
fi

# Install required packages for kiosk mode
echo "Step 3/7: Installing kiosk mode dependencies..."
sudo apt install -y chromium unclutter xdotool

# Create app directory
echo "Step 4/7: Setting up app directory at $APP_DIR..."

if [ -d "$APP_DIR" ]; then
    echo "Updating existing installation..."
    cd "$APP_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/NicoReplit/DUMDIDO-TODO-v.1.2.git "$APP_DIR"
    cd "$APP_DIR"
fi

# Install dependencies
echo "Step 5/7: Installing dependencies..."
npm install
cd dashboard
npm install
cd ..

# Create systemd services
echo "Step 6/7: Setting up auto-start services..."

# Todo App service
sudo tee /etc/systemd/system/family-todo.service > /dev/null << EOF
[Unit]
Description=Family Todo App
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
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
User=$CURRENT_USER
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

# Step 7: Setup Kiosk Mode
echo "Step 7/7: Setting up kiosk mode (fullscreen app experience)..."

# Create autostart directory
mkdir -p /home/$CURRENT_USER/.config/autostart

# Create kiosk startup script
sudo tee /home/$CURRENT_USER/start-kiosk.sh > /dev/null << 'KIOSKSCRIPT'
#!/bin/bash
# Family Dashboard Kiosk Startup Script

# Wait for services to start
sleep 5

# Disable screen blanking
xset s off
xset s noblank
xset -dpms

# Hide mouse cursor after 1 second of inactivity
unclutter -idle 1 &

# Wait for dashboard to be ready
echo "Waiting for Family Dashboard to start..."
until curl -s http://localhost:5000 > /dev/null 2>&1; do
    sleep 2
done

# Launch Chromium in kiosk mode
chromium \
    --kiosk \
    --noerrdialogs \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --disable-translate \
    --no-first-run \
    --fast \
    --fast-start \
    --disable-features=TranslateUI \
    --check-for-update-interval=31536000 \
    --disable-component-update \
    --overscroll-history-navigation=0 \
    http://localhost:5000
KIOSKSCRIPT

chmod +x /home/$CURRENT_USER/start-kiosk.sh
chown $CURRENT_USER:$CURRENT_USER /home/$CURRENT_USER/start-kiosk.sh

# Create autostart entry for kiosk
cat > /home/$CURRENT_USER/.config/autostart/family-dashboard-kiosk.desktop << EOF
[Desktop Entry]
Type=Application
Name=Family Dashboard Kiosk
Exec=/home/$CURRENT_USER/start-kiosk.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

chown $CURRENT_USER:$CURRENT_USER /home/$CURRENT_USER/.config/autostart/family-dashboard-kiosk.desktop

# Setup auto-login for the current user
echo "Setting up auto-login..."
sudo mkdir -p /etc/lightdm/lightdm.conf.d/
sudo tee /etc/lightdm/lightdm.conf.d/autologin.conf > /dev/null << EOF
[Seat:*]
autologin-user=$CURRENT_USER
autologin-user-timeout=0
EOF

# Get IP address
IP_ADDR=$(hostname -I | awk '{print $1}')

echo ""
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""
echo "Your Family Dashboard is now set up as a dedicated appliance!"
echo ""
echo "What happens now:"
echo "  - On reboot, Pi will auto-login (no password needed)"
echo "  - Dashboard opens automatically in fullscreen"
echo "  - Mouse cursor hides when not moving"
echo "  - No browser controls visible - pure app experience!"
echo ""
echo "To start using it now:"
echo "  Option 1: Reboot with 'sudo reboot'"
echo "  Option 2: Open browser to http://localhost:5000"
echo ""
echo "From another device: http://$IP_ADDR:5000"
echo ""
echo "Useful commands:"
echo "  Exit kiosk mode:    Press Alt+F4"
echo "  Check status:       sudo systemctl status family-dashboard"
echo "  View logs:          sudo journalctl -u family-dashboard -f"
echo "  Restart services:   sudo systemctl restart family-dashboard"
echo ""
