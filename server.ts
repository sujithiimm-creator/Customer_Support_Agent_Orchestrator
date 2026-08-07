import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { processAgentOrchestration, retrieveContextRFC } from './server/geminiService.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'NordHaven Agentic AI Operations Backend' });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { promptText, customerId, agentType, history } = req.body;
      if (!promptText || !customerId) {
        return res.status(400).json({ error: 'Missing required promptText or customerId' });
      }

      const result = await processAgentOrchestration(promptText, customerId, agentType || 'Orchestrator', history || []);
      res.json(result);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.post('/api/rfc', (req, res) => {
    try {
      const { query, category } = req.body;
      const results = retrieveContextRFC(query || '', category);
      res.json({ query, results });
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ error: error.message || 'RFC lookup error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NordHaven Agentic AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
