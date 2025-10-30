const redis = require('../config/redis');

async function setJobStatus(jobId, status) {
  await redis.hset(`job:${jobId}`, 'status', status);
}

async function getJobStatus(jobId) {
  return await redis.hget(`job:${jobId}`, 'status');
}

async function setJobResult(jobId, result) {
  await redis.hset(`job:${jobId}`, 'result', JSON.stringify(result));
}

async function getJobResult(jobId) {
  const result = await redis.hget(`job:${jobId}`, 'result');
  return result ? JSON.parse(result) : null;
}

module.exports = {
  setJobStatus,
  getJobStatus,
  setJobResult,
  getJobResult,
};
