import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const APPS_SEARCH_PATHS = [
  path.join(__dirname, '../../'),
  '/home/pi/apps',
  '/opt/family-dashboard/apps'
];

function findAppManifests() {
  const apps = [];
  
  for (const searchPath of APPS_SEARCH_PATHS) {
    if (!fs.existsSync(searchPath)) continue;
    
    try {
      const entries = fs.readdirSync(searchPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (!entry.isDirectory()) {
          const manifestPath = path.join(searchPath, 'app-manifest.json');
          if (fs.existsSync(manifestPath)) {
            try {
              const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
              if (manifest.dashboard?.showInDashboard !== false) {
                apps.push({
                  ...manifest.app,
                  display: manifest.display,
                  entry: manifest.entry,
                  runtime: manifest.runtime,
                  dashboard: manifest.dashboard,
                  manifestPath: manifestPath
                });
              }
            } catch (e) {
              console.error(`Error reading manifest at ${manifestPath}:`, e.message);
            }
          }
          continue;
        }
        
        const manifestPath = path.join(searchPath, entry.name, 'app-manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            if (manifest.dashboard?.showInDashboard !== false) {
              apps.push({
                ...manifest.app,
                display: manifest.display,
                entry: manifest.entry,
                runtime: manifest.runtime,
                dashboard: manifest.dashboard,
                manifestPath: manifestPath
              });
            }
          } catch (e) {
            console.error(`Error reading manifest at ${manifestPath}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.error(`Error scanning ${searchPath}:`, e.message);
    }
  }
  
  return apps;
}

app.get('/api/apps', (req, res) => {
  const apps = findAppManifests();
  res.json(apps);
});

app.get('/api/images', (req, res) => {
  const imagesPath = req.query.path || '/home/pi/Pictures/slideshow';
  const images = [];
  
  if (fs.existsSync(imagesPath)) {
    try {
      const entries = fs.readdirSync(imagesPath);
      for (const entry of entries) {
        const ext = path.extname(entry).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          images.push(path.join(imagesPath, entry));
        }
      }
    } catch (e) {
      console.error(`Error reading images from ${imagesPath}:`, e.message);
    }
  }
  
  res.json(images);
});

app.use('/local-images', (req, res) => {
  const imagePath = req.query.path;
  if (!imagePath || !fs.existsSync(imagePath)) {
    return res.status(404).send('Image not found');
  }
  res.sendFile(imagePath);
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard API running on port ${PORT}`);
});
