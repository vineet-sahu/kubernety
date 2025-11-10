const request = require('supertest');
const app = require('../../src/index');

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'api-gateway');
    });
  });

  describe('POST /api/submit', () => {
    it('should submit a job', async () => {
      const response = await request(app)
        .post('/api/submit')
        .send({
          task: 'calculate_primes',
          data: { limit: 1000 }
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('jobId');
      expect(response.body.data).toHaveProperty('status', 'pending');
    });

    it('should return 400 for invalid task', async () => {
      const response = await request(app)
        .post('/api/submit')
        .send({
          task: 'invalid_task'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing task', async () => {
      const response = await request(app)
        .post('/api/submit')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/status/:jobId', () => {
    it('should return 400 for invalid job ID format', async () => {
      const response = await request(app)
        .get('/api/status/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
