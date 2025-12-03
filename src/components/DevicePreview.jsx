import { useState } from 'react';
import './DevicePreview.css';

const DEVICES = [
  { id: 'custom', name: 'Custom Display', width: 800, height: 1280 },
  { id: 'rpi-10', name: 'Raspberry Pi 10.1"', width: 1280, height: 800 },
  { id: 'ipad', name: 'iPad', width: 1024, height: 768 },
  { id: 'ipad-pro', name: 'iPad Pro 11"', width: 1194, height: 834 },
  { id: 'tablet-7', name: 'Tablet 7"', width: 1024, height: 600 },
  { id: 'phone', name: 'Phone', width: 390, height: 844 },
];

export default function DevicePreview({ children, isEnabled, onToggle }) {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [scale, setScale] = useState(1);

  const device = selectedDevice;
  const deviceVmin = Math.min(device.width, device.height);

  if (!isEnabled) {
    return (
      <div 
        className="device-screen-fullscreen"
        style={{
          '--device-width': `${window.innerWidth}px`,
          '--device-height': `${window.innerHeight}px`,
          '--device-vmin': `${Math.min(window.innerWidth, window.innerHeight)}px`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="device-preview-container">
      <div className="device-preview-controls">
        <div className="device-selector">
          <label>Device:</label>
          <select 
            value={device.id} 
            onChange={(e) => setSelectedDevice(DEVICES.find(d => d.id === e.target.value))}
          >
            {DEVICES.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.width}x{d.height})
              </option>
            ))}
          </select>
        </div>
        <div className="scale-selector">
          <label>Scale:</label>
          <select value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}>
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
          </select>
        </div>
        <div className="device-info">
          {device.width} x {device.height}px
        </div>
        <button className="preview-close-btn" onClick={onToggle}>
          Exit Preview
        </button>
      </div>
      
      <div className="device-preview-wrapper">
        <div 
          className="device-frame"
          style={{
            width: device.width * scale,
            height: device.height * scale,
          }}
        >
          <div 
            className="device-screen"
            style={{
              '--device-width': `${device.width}px`,
              '--device-height': `${device.height}px`,
              '--device-vmin': `${deviceVmin}px`,
              width: device.width,
              height: device.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {children}
          </div>
        </div>
        <div className="device-label">
          {device.name}
        </div>
      </div>
    </div>
  );
}
