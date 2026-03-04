import express from 'express';

export const app = express();

app.get('/api/worker/health-worker', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'worker-service',
    status: 'running',
  });
});
