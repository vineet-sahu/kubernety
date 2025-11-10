const jobController = require('../../src/controllers/job.controller');
const queueService = require('../../src/services/queue.service');

jest.mock('../../src/services/queue.service');
jest.mock('../../src/utils/logger');

describe('Job Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitJob', () => {
    it('should submit job successfully', async () => {
      req.body = {
        task: 'calculate_primes',
        data: { limit: 1000 }
      };

      queueService.enqueueJob.mockResolvedValue(true);
      queueService.setJobStatus.mockResolvedValue(true);

      await jobController.submitJob(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            jobId: expect.any(String),
            status: 'pending'
          })
        })
      );
    });

    it('should handle errors', async () => {
      req.body = {
        task: 'calculate_primes'
      };

      queueService.enqueueJob.mockRejectedValue(new Error('Redis error'));

      await jobController.submitJob(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getJobStatus', () => {
    it('should return job status', async () => {
      req.params.jobId = '123e4567-e89b-12d3-a456-426614174000';

      queueService.getJobStatus.mockResolvedValue('completed');
      queueService.getJobResult.mockResolvedValue(JSON.stringify({ result: 100 }));

      await jobController.getJobStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'completed',
            result: { result: 100 }
          })
        })
      );
    });

    it('should return 404 for non-existent job', async () => {
      req.params.jobId = '123e4567-e89b-12d3-a456-426614174000';

      queueService.getJobStatus.mockResolvedValue(null);

      await jobController.getJobStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
