const express = require('express');
const router = express.Router();

const jobController = require('../controllers/job.controller');
const healthController = require('../controllers/health.controller');
const validationMiddleware = require('../middleware/validation.middleware');

router.get('/health', healthController.healthCheck);
router.get('/ready', healthController.readinessCheck);

router.post('/jobs', 
  validationMiddleware.validateJobSubmission, 
  jobController.submitJob
);

router.get('/status/:jobId', 
  validationMiddleware.validateJobId,
  jobController.getJobStatus
);

router.get('/jobs', jobController.getAllJobs);

router.delete('/jobs/:jobId',
  validationMiddleware.validateJobId,
  jobController.cancelJob
);

module.exports = router;
