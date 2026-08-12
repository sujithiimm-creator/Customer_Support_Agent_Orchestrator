import express from 'express';
import { processAgentOrchestration, retrieveContextRFC } from './geminiService.js';

export function createApiApp() {
  const app = express();

  app.use(express.json());

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

  return app;
}
