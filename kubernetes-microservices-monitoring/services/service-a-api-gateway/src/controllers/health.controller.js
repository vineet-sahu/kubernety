const redisClient = require('../config/redis');
const { successResponse, errorResponse } = require('../utils/response');

class HealthController {
  /**
   * Health check endpoint
   */
  async healthCheck(req, res) {
    try {
      return successResponse(res, {
        status: 'healthy',
        service: 'api-gateway',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    } catch (error) {
      return errorResponse(res, 'Health check failed', 500);
    }
  }

  /**
   * Readiness check
   */
  async readinessCheck(req, res) {
    try {
      await redisClient.ping();
      return successResponse(res, {
        status: 'ready',
        redis: 'connected'
      });
    } catch (error) {
      return errorResponse(res, 'Service not ready', 503, {
        redis: 'disconnected'
      });
    }
  }
}

module.exports = new HealthController();
