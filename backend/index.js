require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const votesRouter = require('./routes/votes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow the deployed frontend and local dev hosts.
// You can override the allowed frontend origin by setting FRONTEND_URL in Render/Vercel.
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://fanvote-eight.vercel.app'

// Temporarily allow all origins so the browser receives Access-Control-Allow-Origin
// and we can debug the 400 response. For production, restrict this to specific origins
// (e.g., FRONTEND_URL or a whitelist).
app.use(cors())

// Log incoming origin for debugging purposes
app.use((req, res, next) => {
  const origin = req.get('origin') || 'no-origin'
  console.log(`[CORS DEBUG] incoming origin: ${origin} -> ${req.method} ${req.url}`)
  next()
})
app.use(bodyParser());

app.use('/api', votesRouter);

app.get('/', (req, res) => {
  res.send({ message: 'VoteChain backend running', api: '/api' });
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`VoteChain backend listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
