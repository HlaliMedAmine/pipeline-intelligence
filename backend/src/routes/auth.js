import express from 'express';
import jwt from 'jsonwebtoken';
import { AzureDevOpsService } from '../services/azureDevOps.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pipeline-intelligence-secret-2024';

// POST /api/auth/connect
router.post('/connect', async (req, res) => {
  const { orgUrl, pat } = req.body;

  if (!orgUrl || !pat) {
    return res.status(400).json({ error: 'orgUrl and pat are required' });
  }

  try {
    const service = new AzureDevOpsService(orgUrl, pat);
    const projects = await service.getProjects();

    const token = jwt.sign({ orgUrl, pat }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      projects: projects.map((p) => ({ id: p.id, name: p.name })),
    });
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({
      error: 'Failed to connect. Check your Organization URL and PAT token.',
    });
  }
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, orgUrl: decoded.orgUrl });
  } catch {
    res.status(401).json({ valid: false });
  }
});

export default router;
