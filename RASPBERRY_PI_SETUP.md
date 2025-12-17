# Family Dashboard - Raspberry Pi Setup

Transform your Raspberry Pi into a dedicated family dashboard appliance!

## Quick Install (One Command!)

Open the Terminal on your Raspberry Pi and paste this:

```bash
curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/family-dashboard/main/install.sh | bash
```

**Replace YOUR_USERNAME with your GitHub username first!**

The installer will automatically:
1. Install Node.js (if needed)
2. Download and install the apps
3. Set up auto-start on boot
4. Configure fullscreen kiosk mode
5. Enable auto-login (no password on boot)
6. Hide the mouse cursor when not in use

No database installation needed - everything runs automatically!

## After Installation

Simply **reboot your Raspberry Pi**:
```bash
sudo reboot
```

Your Pi will:
1. Auto-login (no password screen)
2. Launch the Family Dashboard in fullscreen
3. Hide the mouse cursor automatically

It looks and feels like a dedicated appliance - no browser controls visible!

## Using the Dashboard

- **Touch/tap** to interact with everything
- **Swipe** on todo cards to edit or complete them
- The app fills the entire screen - pure touch experience

### Exiting Kiosk Mode (if needed)

- Press **Alt + F4** to close the fullscreen browser
- Or connect a keyboard and press **Ctrl + Alt + T** to open terminal

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

**Disable auto-login (if needed):**
```bash
sudo rm /etc/lightdm/lightdm.conf.d/autologin.conf
```

## Update to Latest Version

```bash
cd ~/family-dashboard
git pull
npm install
cd dashboard && npm install
sudo systemctl restart family-todo
sudo systemctl restart family-dashboard
sudo reboot
```

## Accessing from Other Devices

Find your Pi's IP address:
```bash
hostname -I
```

Then open in any browser on your network:
```
http://YOUR_PI_IP:5000
```

## Troubleshooting

**Dashboard not loading after reboot?**
1. Wait 30 seconds - it takes time to start
2. Check if services are running: `sudo systemctl status family-dashboard`
3. Look at logs: `sudo journalctl -u family-dashboard -f`

**Screen stays black?**
1. Press any key or touch the screen
2. Check if Pi booted: try connecting via SSH from another computer

**Touch not working?**
1. Make sure your touchscreen drivers are installed
2. Reboot with `sudo reboot`

**Want browser controls back temporarily?**
1. Press Alt+F4 to close kiosk
2. Open regular browser from the desktop menu

**Need to reinstall completely?**
```bash
rm -rf ~/family-dashboard
sudo systemctl disable family-todo
sudo systemctl disable family-dashboard
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

## Hardware Recommendations

For the best experience:
- **Raspberry Pi 4** (2GB+ RAM recommended)
- **Official 7" Touchscreen** or any compatible touchscreen
- **Good power supply** (3A for Pi 4)
- **MicroSD card** (16GB+ recommended)

## What Makes This Feel Like a Real App

The installer sets up:
- **Auto-login**: No password screen on boot
- **Fullscreen kiosk**: No browser buttons or address bar
- **Hidden cursor**: Mouse pointer hides when not moving
- **Auto-start**: Dashboard launches automatically on power-up
- **No updates popups**: All browser notifications disabled

Your family just sees a beautiful, dedicated dashboard - not a "website"!
