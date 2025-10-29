const { v4: uuidv4 } = require('uuid');
const queueService = require('../services/queue.service');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

class JobController {
  async submitJob(req, res, next) {
    try {
      const { task, data } = req.body;

      console.log(task, data);
      
      if (!task) {
        return errorResponse(res, 'Task is required', 400);
      }

      
      const jobId = uuidv4();

      const jobType = JobController.getJobTypeFromTask(task);

      const job = {
        id: jobId,
        type: jobType,
        task,
        data: data || {},
        status: 'pending',
        createdAt: new Date().toISOString(),
        retries: 0
      };
      
      await queueService.enqueueJob(job);
      
      await queueService.setJobStatus(jobId, 'pending');
      
      await queueService.setJobMetadata(jobId, {
        type: jobType,
        payload: data || {},
        createdAt: job.createdAt
      });

      logger.info(`Job ${jobId} submitted successfully`, { task });

      return successResponse(res, {
        id: jobId,
        jobId,
        status: 'pending',
        message: 'Job submitted successfully'
      }, 201);
    } catch (error) {
      logger.error('Error submitting job:', error);
      next(error);
    }
  }

  async getJobStatus(req, res, next) {
    try {
      const { jobId } = req.params;

      
      const status = await queueService.getJobStatus(jobId);

      if (!status) {
        return errorResponse(res, 'Job not found', 404);
      }

      
      const metadata = await queueService.getJobMetadata(jobId);

      
      let result = null;
      if (status === 'completed') {
        result = await queueService.getJobResult(jobId);
      }

      return successResponse(res, {
        id: jobId,
        jobId,
        type: metadata?.type || 'unknown',
        status: JobController.normalizeStatus(status),
        payload: metadata?.payload || {},
        result: result ? JSON.parse(result) : null,
        createdAt: metadata?.createdAt || null
      });
    } catch (error) {
      logger.error('Error getting job status:', error);
      next(error);
    }
  }

  async getAllJobs(req, res, next) {
    try {
      
      const jobIds = await queueService.getAllJobIds();
      
      if (!jobIds || jobIds.length === 0) {
        return successResponse(res, []);
      }

      
      const jobs = await Promise.all(
        jobIds.map(async (jobId) => {
          try {
            const status = await queueService.getJobStatus(jobId);
            const metadata = await queueService.getJobMetadata(jobId);
            
            let result = null;
            if (status === 'completed') {
              const resultData = await queueService.getJobResult(jobId);
              result = resultData ? JSON.parse(resultData) : null;
            }

            return {
              id: jobId,
              type: metadata?.type || 'unknown',
              status: JobController.normalizeStatus(status),
              payload: metadata?.payload || {},
              result,
              createdAt: metadata?.createdAt || null
            };
          } catch (error) {
            logger.error(`Error fetching job ${jobId}:`, error);
            return null;
          }
        })
      );

      
      const validJobs = jobs.filter(job => job !== null);

      
      validJobs.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return successResponse(res, validJobs);
    } catch (error) {
      logger.error('Error getting all jobs:', error);
      next(error);
    }
  }

  async cancelJob(req, res, next) {
    try {
      const { jobId } = req.params;

      const status = await queueService.getJobStatus(jobId);

      if (!status) {
        return errorResponse(res, 'Job not found', 404);
      }

      if (status === 'completed' || status === 'failed') {
        return errorResponse(res, 'Cannot cancel completed or failed job', 400);
      }

      await queueService.setJobStatus(jobId, 'cancelled');

      logger.info(`Job ${jobId} cancelled`);

      return successResponse(res, {
        id: jobId,
        jobId,
        status: 'cancelled',
        message: 'Job cancelled successfully'
      });
    } catch (error) {
      logger.error('Error cancelling job:', error);
      next(error);
    }
  }

  static getJobTypeFromTask(task) {
    const taskTypeMap = {
      'calculate_primes': 'prime',
      'hash_text': 'hash',
      'sort_array': 'sort',
      'matrix_multiply': 'matrix',
      'fibonacci': 'fib'
    };
    return taskTypeMap[task] || task;
  }

  static normalizeStatus(status) {
    const statusMap = {
      'pending': 'Queued',
      'queued': 'Queued',
      'processing': 'Processing',
      'completed': 'Done',
      'failed': 'Failed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status.toLowerCase()] || status;
  }
}

module.exports = new JobController();