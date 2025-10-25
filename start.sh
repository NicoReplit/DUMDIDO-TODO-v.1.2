#!/bin/bash
node server/index.js &
npx vite --host 0.0.0.0 --port 5000
