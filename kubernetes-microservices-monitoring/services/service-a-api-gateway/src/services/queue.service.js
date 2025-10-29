const redisClient = require('../config/redis');
const logger = require('../utils/logger');

const QUEUE_NAME = process.env.QUEUE_NAME || 'job_queue';
const STATUS_PREFIX = process.env.STATUS_KEY_PREFIX || 'job_status:';
const RESULT_PREFIX = process.env.RESULTS_KEY_PREFIX || 'job_result:';
const METADATA_PREFIX = process.env.METADATA_KEY_PREFIX || 'job_metadata:';
const JOB_IDS_SET = process.env.JOB_IDS_SET || 'job_ids';
const TTL_SECONDS = parseInt(process.env.JOB_TTL_SECONDS) || 604800; 

class QueueService {
  async enqueueJob(job) {
    try {
      const jobString = JSON.stringify(job);
      await redisClient.lPush(QUEUE_NAME, jobString);
      
      await redisClient.sAdd(JOB_IDS_SET, job.id);
      logger.debug(`Job ${job.id} added to queue`);
      return true;
    } catch (error) {
      logger.error('Error enqueueing job:', error);
      throw error;
    }
  }

  async setJobStatus(jobId, status) {
    try {
      const key = `${STATUS_PREFIX}${jobId}`;
      await redisClient.set(key, status, {
        EX: TTL_SECONDS
      });
      return true;
    } catch (error) {
      logger.error('Error setting job status:', error);
      throw error;
    }
  }

  async getJobStatus(jobId) {
    try {
      const key = `${STATUS_PREFIX}${jobId}`;
      const status = await redisClient.get(key);
      return status;
    } catch (error) {
      logger.error('Error getting job status:', error);
      throw error;
    }
  }

  async setJobMetadata(jobId, metadata) {
    try {
      const key = `${METADATA_PREFIX}${jobId}`;
      await redisClient.set(key, JSON.stringify(metadata), {
        EX: TTL_SECONDS
      });
      logger.debug(`Job ${jobId} metadata stored`);
      return true;
    } catch (error) {
      logger.error('Error setting job metadata:', error);
      throw error;
    }
  }

  async getJobMetadata(jobId) {
    try {
      const key = `${METADATA_PREFIX}${jobId}`;
      const metadata = await redisClient.get(key);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      logger.error('Error getting job metadata:', error);
      throw error;
    }
  }

  async getJobResult(jobId) {
    try {
      const key = `${RESULT_PREFIX}${jobId}`;
      const result = await redisClient.get(key);
      return result;
    } catch (error) {
      logger.error('Error getting job result:', error);
      throw error;
    }
  }

  async getAllJobIds() {
    try {
      const jobIds = await redisClient.sMembers(JOB_IDS_SET);
      return jobIds || [];
    } catch (error) {
      logger.error('Error getting all job IDs:', error);
      throw error;
    }
  }

  async getQueueLength() {
    try {
      const length = await redisClient.lLen(QUEUE_NAME);
      return length;
    } catch (error) {
      logger.error('Error getting queue length:', error);
      throw error;
    }
  }

  async clearCompletedJobs() {
    try {
      const pattern = `${STATUS_PREFIX}*`;
      const keys = await redisClient.keys(pattern);
      
      let cleared = 0;
      for (const key of keys) {
        const status = await redisClient.get(key);
        if (status === 'completed' || status === 'failed') {
          
          const jobId = key.replace(STATUS_PREFIX, '');
          
          
          await redisClient.del(key);
          await redisClient.del(`${RESULT_PREFIX}${jobId}`);
          await redisClient.del(`${METADATA_PREFIX}${jobId}`);
          await redisClient.sRem(JOB_IDS_SET, jobId);
          
          cleared++;
        }
      }
      
      logger.info(`Cleared ${cleared} completed jobs`);
      return cleared;
    } catch (error) {
      logger.error('Error clearing completed jobs:', error);
      throw error;
    }
  }

  async removeJobFromTracking(jobId) {
    try {
      await redisClient.sRem(JOB_IDS_SET, jobId);
      logger.debug(`Job ${jobId} removed from tracking`);
      return true;
    } catch (error) {
      logger.error('Error removing job from tracking:', error);
      throw error;
    }
  }

  async getQueueStats() {
    try {
      const queueLength = await this.getQueueLength();
      const allJobIds = await this.getAllJobIds();
      
      const stats = {
        queued: queueLength,
        total: allJobIds.length,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        cancelled: 0
      };

      const statusPromises = allJobIds.map(async (jobId) => {
        try {
          const status = await this.getJobStatus(jobId);
          return { jobId, status };
        } catch (error) {
          logger.error(`Error getting status for job ${jobId}:`, error);
          return { jobId, status: null };
        }
      });

      const results = await Promise.all(statusPromises);
      
      results.forEach(({ status }) => {
        if (status && stats[status.toLowerCase()] !== undefined) {
          stats[status.toLowerCase()]++;
        }
      });

      return stats;
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      throw error;
    }
  }
}

module.exports = new QueueService();