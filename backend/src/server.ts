import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import cors from 'cors';
import { ENV } from './config/env';
import projectRouter from './modules/projects/routes/projectRoutes';
import containerRouter from './modules/containers/routes/containerRoutes';
import healthRouter from './modules/health/routes/healthRoutes';
import { TerminalGateway } from './modules/terminal/gateway/terminalGateway';
import { DockerInitializer } from './infrastructure/docker/DockerInitializer';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Health probe
app.use('/health', healthRouter);

// Scoped APIs
app.use('/api/projects', projectRouter);
app.use('/api/projects/:projectId/containers', containerRouter);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

TerminalGateway.handleConnections(io);

// Serve the built frontend from the same origin/port as the API, so the
// browser never needs to reach a second port directly — required for
// deployments behind a reverse proxy or tunnel that only forwards one port.
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

server.listen(ENV.PORT, () => {
  console.log(`Backend server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
  // Run background Docker check & pull
  DockerInitializer.initialize();
});
