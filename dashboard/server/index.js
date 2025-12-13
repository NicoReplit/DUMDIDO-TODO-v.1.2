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
  const seenIds = new Set();
  
  for (const searchPath of APPS_SEARCH_PATHS) {
    if (!fs.existsSync(searchPath)) continue;
    
    try {
      // First check for manifest at the search path root level
      const rootManifestPath = path.join(searchPath, 'app-manifest.json');
      if (fs.existsSync(rootManifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(rootManifestPath, 'utf-8'));
          if (manifest.dashboard?.showInDashboard !== false && !seenIds.has(manifest.app?.id)) {
            seenIds.add(manifest.app?.id);
            apps.push({
              ...manifest.app,
              display: manifest.display,
              entry: manifest.entry,
              runtime: manifest.runtime,
              dashboard: manifest.dashboard,
              manifestPath: rootManifestPath
            });
          }
        } catch (e) {
          console.error(`Error reading manifest at ${rootManifestPath}:`, e.message);
        }
      }
      
      // Then check subdirectories
      const entries = fs.readdirSync(searchPath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const manifestPath = path.join(searchPath, entry.name, 'app-manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            if (manifest.dashboard?.showInDashboard !== false && !seenIds.has(manifest.app?.id)) {
              seenIds.add(manifest.app?.id);
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

const ALLOWED_IMAGE_DIRS = [
  '/home/pi/Pictures',
  '/home/pi/photos',
  '/opt/family-dashboard/images'
];

app.get('/api/local-images', (req, res) => {
  const imagePath = req.query.path;
  if (!imagePath) {
    return res.status(400).send('Path required');
  }
  
  const resolvedPath = path.resolve(imagePath);
  const isAllowed = ALLOWED_IMAGE_DIRS.some(dir => {
    const normalizedDir = path.resolve(dir);
    return resolvedPath === normalizedDir || resolvedPath.startsWith(normalizedDir + path.sep);
  });
  
  if (!isAllowed) {
    return res.status(403).send('Access denied');
  }
  
  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).send('Image not found');
  }
  
  const stat = fs.statSync(resolvedPath);
  if (!stat.isFile()) {
    return res.status(400).send('Not a file');
  }
  
  res.sendFile(resolvedPath);
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard API running on port ${PORT}`);
});
