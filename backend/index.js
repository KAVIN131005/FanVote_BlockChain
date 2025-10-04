const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const votesRouter = require('./routes/votes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser());

app.use('/api', votesRouter);

app.get('/', (req, res) => {
  res.send({ message: 'VoteChain backend running', api: '/api' });
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`VoteChain backend listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
