import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authMiddleware } from '../middleware/auth.js';
import { AzureDevOpsService } from '../services/azureDevOps.js';

const router = express.Router();

// POST /api/ai/recommendations
router.post('/recommendations', authMiddleware, async (req, res) => {
  const { project, pipelineData } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let data = pipelineData;
    if (!data) {
      const service = new AzureDevOpsService(req.orgUrl, req.pat);
      data = await service.analyzePipelines(project);
    }

    const prompt = `You are a DevOps expert analyzing Azure DevOps pipeline performance data.

Pipeline data:
${JSON.stringify(data.slice(0, 10), null, 2)}

Analyze this data and return ONLY a JSON object (no markdown, no backticks) with this structure:
{
  "critical": [
    {
      "title": "Issue title",
      "description": "Clear explanation of the problem",
      "impact": "Expected time/cost savings",
      "solution": "Specific YAML or config fix",
      "pipeline": "pipeline name"
    }
  ],
  "medium": [...same structure],
  "quickWins": [...same structure],
  "summary": "2-3 sentence executive summary of overall pipeline health"
}

Focus on: caching, parallelization, retry logic, timeouts, slow steps, high failure rates.
Be specific with YAML examples in the solution field.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let recommendations;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      recommendations = JSON.parse(clean);
    } catch {
      recommendations = {
        critical: [],
        medium: [],
        quickWins: [],
        summary: text,
      };
    }

    res.json(recommendations);
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
