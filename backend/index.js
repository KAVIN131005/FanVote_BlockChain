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
const allowedOrigins = [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174']

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true)

    // Allow exact matches
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true)

    // Allow any Vercel preview/deployment subdomain (e.g., https://my-app-pr-1.vercel.app)
    try {
      const hostname = new URL(origin).hostname
      if (hostname && hostname.endsWith('.vercel.app')) return callback(null, true)
    } catch (e) {
      // ignore URL parse errors
    }

    // Log rejected origin for easier debugging
    console.warn(`CORS rejection: origin not allowed -> ${origin}`)
    return callback(new Error('CORS policy: This origin is not allowed'))
  }
}))
app.use(bodyParser());

app.use('/api', votesRouter);

app.get('/', (req, res) => {
  res.send({ message: 'VoteChain backend running', api: '/api' });
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`VoteChain backend listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
