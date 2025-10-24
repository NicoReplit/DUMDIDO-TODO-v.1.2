# Raspberry Pi Setup Guide

This guide will help you install and run the Family To-Do App on your Raspberry Pi with a touchscreen.

## Prerequisites

- Raspberry Pi (Model 3B+ or newer recommended)
- Touchscreen display
- Raspbian OS (or Raspberry Pi OS)
- Internet connection (only for initial setup)

## Step 1: Install Node.js

```bash
# Update package list
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

## Step 2: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE family_todo;"
sudo -u postgres psql -c "CREATE USER todouser WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE family_todo TO todouser;"
```

## Step 3: Install the App

```bash
# Clone or copy the project to your Pi
cd ~
# (Copy the entire project folder to your Pi via USB, SCP, or git)

# Navigate to the project folder
cd family-todo-app

# Install dependencies
npm install
```

## Step 4: Configure Environment

```bash
# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://todouser:yourpassword@localhost:5432/family_todo
NODE_ENV=production
EOF
```

## Step 5: Start the App

### Option A: Manual Start (for testing)

```bash
# Start both backend and frontend
npm run dev
```

The app will be available at `http://localhost:5000`

### Option B: Auto-start on Boot (recommended)

```bash
# Create systemd service file
sudo nano /etc/systemd/system/family-todo.service
```

Paste this content:

```ini
[Unit]
Description=Family To-Do App
After=network.target postgresql.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/family-todo-app
Environment=DATABASE_URL=postgresql://todouser:yourpassword@localhost:5432/family_todo
ExecStart=/usr/bin/npm run dev
Restart=always

[Install]
WantedBy=multi-user.target
```

Save and enable:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable the service
sudo systemctl enable family-todo.service

# Start the service
sudo systemctl start family-todo.service

# Check status
sudo systemctl status family-todo.service
```

## Step 6: Configure Browser for Kiosk Mode

Install Chromium (if not already installed):

```bash
sudo apt install -y chromium-browser unclutter
```

Create auto-start script:

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/family-todo.desktop
```

Paste this content:

```ini
[Desktop Entry]
Type=Application
Name=Family To-Do
Exec=chromium-browser --kiosk --disable-restore-session-state http://localhost:5000
```

Configure to hide cursor when idle:

```bash
nano ~/.config/autostart/unclutter.desktop
```

Paste:

```ini
[Desktop Entry]
Type=Application
Name=Unclutter
Exec=unclutter -idle 1
```

## Step 7: Reboot and Test

```bash
sudo reboot
```

After reboot, the app should automatically start in fullscreen mode!

## Tips for Touchscreen Use

- **Fullscreen Navigation**: Swipe from the top to access browser controls if needed
- **Reload**: If the app gets stuck, press Ctrl+R to reload
- **Exit Kiosk Mode**: Press Alt+F4 or Ctrl+W

## Troubleshooting

### App won't start
```bash
# Check service status
sudo systemctl status family-todo.service

# View logs
sudo journalctl -u family-todo.service -f
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists
sudo -u postgres psql -c "\l"
```

### Port already in use
```bash
# Kill existing processes
pkill -f "node server/index.js"
pkill -f "vite"

# Restart service
sudo systemctl restart family-todo.service
```

## Backup Your Data

To backup your to-dos:

```bash
# Backup database
sudo -u postgres pg_dump family_todo > ~/family_todo_backup.sql

# Restore from backup
sudo -u postgres psql family_todo < ~/family_todo_backup.sql
```

## Updating the App

```bash
cd ~/family-todo-app
git pull  # or copy updated files
npm install  # if dependencies changed
sudo systemctl restart family-todo.service
```

---

Enjoy your Family To-Do App! 🎉
