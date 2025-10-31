const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const { register } = require('./metrics/prometheus');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api', routes);


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'stats' });
});

app.listen(PORT, () => {
  logger.info(`Service C (Stats) running on port ${PORT}`);
});
