import axios from 'axios';

export class AzureDevOpsService {
  constructor(orgUrl, pat) {
    this.orgUrl = orgUrl.replace(/\/$/, '');
    this.pat = pat;
    this.headers = {
      Authorization: `Basic ${Buffer.from(`:${pat}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  async getProjects() {
    const url = `${this.orgUrl}/_apis/projects?api-version=7.0`;
    const res = await axios.get(url, { headers: this.headers });
    return res.data.value;
  }

  async getPipelines(project) {
    const url = `${this.orgUrl}/${project}/_apis/pipelines?api-version=7.0`;
    const res = await axios.get(url, { headers: this.headers });
    return res.data.value;
  }

  async getPipelineRuns(project, pipelineId, top = 30) {
    const url = `${this.orgUrl}/${project}/_apis/pipelines/${pipelineId}/runs?api-version=7.0&$top=${top}`;
    const res = await axios.get(url, { headers: this.headers });
    return res.data.value;
  }

  async getBuildTimeline(project, buildId) {
    const url = `${this.orgUrl}/${project}/_apis/build/builds/${buildId}/timeline?api-version=7.0`;
    const res = await axios.get(url, { headers: this.headers });
    return res.data.records || [];
  }

  async getAllBuilds(project, top = 50) {
    const url = `${this.orgUrl}/${project}/_apis/build/builds?api-version=7.0&$top=${top}&queryOrder=startTimeDescending`;
    const res = await axios.get(url, { headers: this.headers });
    return res.data.value;
  }

  async analyzePipelines(project) {
    const builds = await this.getAllBuilds(project, 100);

    const pipelineMap = {};

    for (const build of builds) {
      const defId = build.definition.id;
      const defName = build.definition.name;

      if (!pipelineMap[defId]) {
        pipelineMap[defId] = {
          id: defId,
          name: defName,
          runs: [],
          totalDuration: 0,
          successCount: 0,
          failureCount: 0,
        };
      }

      const p = pipelineMap[defId];
      const duration =
        build.startTime && build.finishTime
          ? (new Date(build.finishTime) - new Date(build.startTime)) / 1000 / 60
          : 0;

      p.runs.push({
        id: build.id,
        status: build.result,
        duration: Math.round(duration * 10) / 10,
        startTime: build.startTime,
        finishTime: build.finishTime,
        branch: build.sourceBranch,
      });

      p.totalDuration += duration;
      if (build.result === 'succeeded') p.successCount++;
      else if (build.result === 'failed') p.failureCount++;
    }

    return Object.values(pipelineMap).map((p) => ({
      ...p,
      avgDuration: p.runs.length ? Math.round((p.totalDuration / p.runs.length) * 10) / 10 : 0,
      successRate: p.runs.length ? Math.round((p.successCount / p.runs.length) * 100) : 0,
      lastRun: p.runs[0] || null,
    }));
  }
}
