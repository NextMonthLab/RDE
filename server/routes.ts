import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertFileSchema, updateFileSchema } from "@shared/schema";
import { spawn } from "child_process";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for terminal functionality
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active terminal sessions
  const terminalSessions = new Map<string, any>();

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');
    const projectId = url.searchParams.get('projectId');

    if (!sessionId || !projectId) {
      ws.close(1008, 'Missing sessionId or projectId');
      return;
    }

    // Create terminal process
    const terminal = spawn('bash', [], {
      env: { ...process.env, TERM: 'xterm-color' },
      cwd: process.cwd(),
    });

    terminalSessions.set(sessionId, { terminal, ws });

    // Handle terminal output
    terminal.stdout.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
      }
    });

    terminal.stderr.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
      }
    });

    terminal.on('exit', (code) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'exit', code }));
      }
      terminalSessions.delete(sessionId);
    });

    // Handle WebSocket messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'input' && terminal.stdin.writable) {
          terminal.stdin.write(data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      if (terminalSessions.has(sessionId)) {
        const session = terminalSessions.get(sessionId);
        if (session?.terminal) {
          session.terminal.kill();
        }
        terminalSessions.delete(sessionId);
      }
    });

    // Store session in database
    storage.createTerminalSession(parseInt(projectId), sessionId);
  });

  // Projects API
  app.get('/api/projects', async (req, res) => {
    try {
      // For demo purposes, we'll use userId = 1
      // In production, this would come from authenticated session
      const projects = await storage.getProjectsByUser(1);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({ ...projectData, userId: 1 });
      
      // Create initial project structure based on template
      const isSaasProject = projectData.template.includes('saas') || projectData.template.includes('visual');
      
      const rootFiles = [
        {
          name: 'src',
          path: '/src',
          isDirectory: true,
          projectId: project.id,
        },
        {
          name: 'package.json',
          path: '/package.json',
          content: JSON.stringify({
            name: project.name,
            version: '1.0.0',
            scripts: isSaasProject ? {
              dev: 'npm run start',
              build: 'npm run build:saas',
              start: 'node index.js',
              deploy: 'npm run deploy:saas'
            } : {
              dev: 'npm run start',
              build: 'npm run build',
              start: 'node index.js'
            },
            dependencies: isSaasProject ? {
              "react": "^18.0.0",
              "react-dom": "^18.0.0",
              "@nextmonth/builder": "^1.0.0"
            } : {}
          }, null, 2),
          projectId: project.id,
        },
        {
          name: 'README.md',
          path: '/README.md',
          content: `# ${project.name}\n\n${project.description || 'A new project created with NextMonth R.I.D.'}\n\n${
            isSaasProject 
              ? '## SaaS Builder Project\n\nThis project uses the NextMonth visual builder for rapid application development.\n\n### Features\n- Visual drag-and-drop interface\n- Admin panel builder\n- Business planning tools\n- One-click deployment'
              : '## PaaS Development Project\n\nThis project provides full IDE access for custom development.\n\n### Features\n- Complete code editor\n- Terminal access\n- Git integration\n- Custom deployment configuration'
          }`,
          projectId: project.id,
        }
      ];

      // Add SaaS-specific configuration files
      if (isSaasProject) {
        rootFiles.push({
          name: 'builder.config.js',
          path: '/builder.config.js',
          content: `module.exports = {
  builderType: 'saas',
  visualBuilder: {
    enabled: true,
    theme: 'default'
  },
  adminPanel: {
    enabled: true,
    layout: 'sidebar'
  },
  businessPlanner: {
    enabled: true,
    analytics: true
  }
};`,
          projectId: project.id,
        });
      }

      for (const file of rootFiles) {
        await storage.createFile(file);
      }

      res.json(project);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create project' });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // Files API
  app.get('/api/projects/:projectId/files', async (req, res) => {
    try {
      const files = await storage.getFileTree(parseInt(req.params.projectId));
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  app.post('/api/projects/:projectId/files', async (req, res) => {
    try {
      const fileData = insertFileSchema.parse(req.body);
      const file = await storage.createFile({
        ...fileData,
        projectId: parseInt(req.params.projectId),
      });
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create file' });
    }
  });

  app.get('/api/files/:id', async (req, res) => {
    try {
      const file = await storage.getFile(parseInt(req.params.id));
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch file' });
    }
  });

  app.put('/api/files/:id', async (req, res) => {
    try {
      const updates = updateFileSchema.parse(req.body);
      const file = await storage.updateFile(parseInt(req.params.id), updates);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update file' });
    }
  });

  app.delete('/api/files/:id', async (req, res) => {
    try {
      const success = await storage.deleteFile(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  // Terminal session API
  app.post('/api/terminal/session', async (req, res) => {
    try {
      const { projectId } = req.body;
      const sessionId = randomBytes(16).toString('hex');
      await storage.createTerminalSession(projectId, sessionId);
      res.json({ sessionId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create terminal session' });
    }
  });

  return httpServer;
}
