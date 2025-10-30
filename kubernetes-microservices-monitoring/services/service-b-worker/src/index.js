

const express = require('express');
require('dotenv').config(); 

const { startWorker } = require('./workers/job.consumer');  
const { register } = require('./metrics/prometheus');       
const logger = require('./utils/logger');                   

const app = express();
const METRICS_PORT = process.env.METRICS_PORT || 9090; 


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType); 
  res.end(await register.metrics()); 
});


app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'worker' });  
});


app.listen(METRICS_PORT, () => {
  logger.info(`Service B (Worker) metrics available on port ${METRICS_PORT}`);
});


startWorker().then(() => {
  logger.info('Worker service started and listening for jobs...');
}).catch((error) => {
  logger.error('Failed to start worker service', error);
});
