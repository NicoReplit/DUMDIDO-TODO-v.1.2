# Family Dashboard - Raspberry Pi Setup

## Quick Install (One Command!)

Open the Terminal on your Raspberry Pi and paste this:

```bash
curl -sSL https://raw.githubusercontent.com/NicoReplit/family-dashboard/main/install.sh | bash
```

**Replace YOUR_USERNAME with your GitHub username first!**

That's it! The installer will:
1. Install Node.js (if needed)
2. Download the apps
3. Install everything
4. Set up auto-start on boot

No database installation needed - everything runs automatically!

## After Installation

Open a web browser and go to:
```
http://localhost:5000
```

Or from another device on your network:
```
http://YOUR_PI_IP:5000
```

## Helpful Commands

**Check if apps are running:**
```bash
sudo systemctl status family-dashboard
sudo systemctl status family-todo
```

**Restart the apps:**
```bash
sudo systemctl restart family-dashboard
sudo systemctl restart family-todo
```

**View logs (if something goes wrong):**
```bash
sudo journalctl -u family-dashboard -f
```

**Stop the apps:**
```bash
sudo systemctl stop family-dashboard
sudo systemctl stop family-todo
```

## Update to Latest Version

```bash
cd ~/family-dashboard
git pull
npm install
cd dashboard && npm install
sudo systemctl restart family-todo
sudo systemctl restart family-dashboard
```

## Kiosk Mode (Fullscreen on Boot)

To make the Pi start in fullscreen browser mode:

```bash
sudo apt install -y chromium-browser unclutter

mkdir -p ~/.config/autostart

cat > ~/.config/autostart/family-dashboard.desktop << EOF
[Desktop Entry]
Type=Application
Name=Family Dashboard
Exec=chromium-browser --kiosk --disable-restore-session-state http://localhost:5000
EOF

cat > ~/.config/autostart/unclutter.desktop << EOF
[Desktop Entry]
Type=Application
Name=Unclutter
Exec=unclutter -idle 1
EOF
```

Reboot and the dashboard will start automatically in fullscreen!

## Troubleshooting

**Dashboard not loading?**
1. Check if services are running: `sudo systemctl status family-dashboard`
2. Look at logs: `sudo journalctl -u family-dashboard -f`

**Todo app not working?**
1. Check if service is running: `sudo systemctl status family-todo`
2. Look at logs: `sudo journalctl -u family-todo -f`

**Need to reinstall?**
```bash
rm -rf ~/family-dashboard
# Then run the install command again
```

## Backup Your Data

Your data is stored in a single file. To backup:
```bash
cp ~/family-dashboard/data/familytodo.db ~/familytodo_backup.db
```

To restore:
```bash
cp ~/familytodo_backup.db ~/family-dashboard/data/familytodo.db
sudo systemctl restart family-todo
```
