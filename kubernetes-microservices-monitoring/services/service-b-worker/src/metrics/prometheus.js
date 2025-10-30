

const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });


const jobCounter = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total number of jobs processed by the worker',
  labelNames: ['status'],
});

const jobDuration = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Duration of job processing',
  buckets: [0.5, 1, 2, 3, 5, 10],
});

register.registerMetric(jobCounter);
register.registerMetric(jobDuration);

module.exports = { register, jobCounter, jobDuration };
