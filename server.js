import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const startTime = new Date();
let isReady = true;

// Parse JSON request bodies
app.use(express.json());

// ── Health Probes & Monitoring Endpoints ─────────────────────────────────
// Liveness Probe: Returns 200 if the process is alive
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((new Date() - startTime) / 1000)
  });
});

// Readiness Probe: Returns 200 if the server is ready to accept traffic
app.get('/readyz', (req, res) => {
  if (!isReady) {
    return res.status(503).json({ status: 'not_ready' });
  }

  const distPath = path.join(__dirname, 'dist', 'index.html');
  // Check if build files are present
  if (fs.existsSync(distPath)) {
    return res.status(200).json({ status: 'ready' });
  }
  return res.status(503).json({ status: 'dist_not_found' });
});

// API Info/Status Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'AlertX',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    hostname: process.env.HOSTNAME || 'localhost',
    uptime: Math.floor((new Date() - startTime) / 1000),
    timestamp: new Date().toISOString()
  });
});

// Serve static build files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback route for SPA in Express 5
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  next();
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AlertX] Server running on port ${PORT} in ${process.env.NODE_ENV || 'production'} mode`);
});

// Graceful shutdown handling for zero-downtime Kubernetes rolling updates
const shutdown = (signal) => {
  console.log(`[AlertX] Received ${signal}. Starting graceful shutdown...`);
  isReady = false;
  server.close(() => {
    console.log('[AlertX] HTTP server closed. Process exiting.');
    process.exit(0);
  });

  // Force close after 10s if connections linger
  setTimeout(() => {
    console.error('[AlertX] Forcefully terminating after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

