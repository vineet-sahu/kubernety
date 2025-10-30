const redis = require('../config/redis');
const logger = require('../utils/logger');
const jobProcessor = require('./job.processor');
const { jobCounter, jobDuration } = require('../metrics/prometheus');
const { setJobStatus, setJobResult, getJobStatus } = require('../services/job.queue');

const QUEUE_NAME = process.env.QUEUE_NAME || 'job_queue';

async function processJob(job) {
  const start = Date.now();
  try {
    logger.info(`Worker: Received job ${job.id} of type ${job.type}`);

    if (!jobProcessor[job.type]) {
      throw new Error(`Unknown job type: ${job.type}`);
    }

    logger.info(`Job ${job.id} processing data ${JSON.stringify(job.data)}`);

    await setJobStatus(job.id, 'processing');
    const statusProcessing = await getJobStatus(job.id);
    logger.info(`Job ${job.id} status updated to: ${statusProcessing}`);

    const result = await jobProcessor[job.type](job.data);

    await setJobResult(job.id, JSON.stringify(result));

    
    await setJobStatus(job.id, 'completed');
    const statusCompleted = await getJobStatus(job.id);
    logger.info(`Job ${job.id} status updated to: ${statusCompleted}`);

    logger.info(`✅ Job ${job.id} processed successfully`);

    jobCounter.inc({ status: 'success' });
  } catch (err) {
    
    await setJobStatus(job.id, 'failed');
    const statusFailed = await getJobStatus(job.id);
    logger.error(`❌ Job ${job.id} failed. Status is now: ${statusFailed}. Error: ${err.message}`);

    jobCounter.inc({ status: 'failure' });
  } finally {
    const duration = (Date.now() - start) / 1000;
    jobDuration.observe(duration);
  }
}

async function startWorker() {
  logger.info(`Worker: Waiting for jobs on Redis list "${QUEUE_NAME}"...`);

  while (true) {
    try {
      
      const result = await redis.brpop(QUEUE_NAME, 0);
      const message = result[1];
      const job = JSON.parse(message);

      console.log("this is what i recieved", job);

      logger.info(`Worker: Received job ${job.id} (type: ${job.type})`);
      await processJob(job);
    } catch (err) {
      logger.error(`Worker: Error while processing job: ${err.message}`);
    }
  }
}

module.exports = { startWorker };
