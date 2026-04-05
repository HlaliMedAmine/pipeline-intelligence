import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { AzureDevOpsService } from '../services/azureDevOps.js';

const router = express.Router();

// GET /api/pipelines/:project/overview
router.get('/:project/overview', authMiddleware, async (req, res) => {
  try {
    const service = new AzureDevOpsService(req.orgUrl, req.pat);
    const pipelines = await service.analyzePipelines(req.params.project);

    const totalRuns = pipelines.reduce((sum, p) => sum + p.runs.length, 0);
    const totalSuccess = pipelines.reduce((sum, p) => sum + p.successCount, 0);
    const totalFailed = pipelines.reduce((sum, p) => sum + p.failureCount, 0);
    const avgDuration =
      pipelines.length
        ? Math.round((pipelines.reduce((sum, p) => sum + p.avgDuration, 0) / pipelines.length) * 10) / 10
        : 0;

    const timeWasted = pipelines.reduce((sum, p) => {
      const slowRuns = p.runs.filter((r) => r.duration > p.avgDuration * 1.5);
      return sum + slowRuns.reduce((s, r) => s + r.duration - p.avgDuration, 0);
    }, 0);

    res.json({
      totalPipelines: pipelines.length,
      totalRuns,
      avgDuration,
      successRate: totalRuns ? Math.round((totalSuccess / totalRuns) * 100) : 0,
      timeWasted: Math.round(timeWasted / 60 * 10) / 10,
      pipelines: pipelines.slice(0, 10),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pipelines/:project/list
router.get('/:project/list', authMiddleware, async (req, res) => {
  try {
    const service = new AzureDevOpsService(req.orgUrl, req.pat);
    const pipelines = await service.analyzePipelines(req.params.project);
    res.json(pipelines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pipelines/:project/:pipelineId/detail
router.get('/:project/:pipelineId/detail', authMiddleware, async (req, res) => {
  try {
    const service = new AzureDevOpsService(req.orgUrl, req.pat);
    const runs = await service.getPipelineRuns(req.params.project, req.params.pipelineId, 20);

    const detailedRuns = [];
    for (const run of runs.slice(0, 5)) {
      if (run.id) {
        const timeline = await service.getBuildTimeline(req.params.project, run.id);
        const steps = timeline
          .filter((r) => r.type === 'Task')
          .map((r) => ({
            name: r.name,
            duration: r.startTime && r.finishTime
              ? Math.round((new Date(r.finishTime) - new Date(r.startTime)) / 1000)
              : 0,
            result: r.result,
          }));
        detailedRuns.push({ ...run, steps });
      }
    }

    res.json({ runs, detailedRuns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
