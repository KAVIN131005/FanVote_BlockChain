const express = require('express');
const router = express.Router();
const path = require('path');
const { Blockchain } = require('../blockchain');

const dataFile = path.join(__dirname, '..', 'data', 'chain.json');
const bc = new Blockchain(dataFile);

// Register a voter
router.post('/register', (req, res) => {
  const { voterId } = req.body || {};
  if (!voterId) return res.status(400).json({ error: 'voterId required' });
  try {
    const ok = bc.registerVoter(voterId);
    return res.json({ success: ok, message: ok ? 'registered' : 'already registered' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Cast a vote
router.post('/vote', (req, res) => {
  const { voterId, candidate } = req.body || {};
  if (!voterId || !candidate) return res.status(400).json({ error: 'voterId and candidate required' });
  try {
    const block = bc.addVote(voterId, candidate);
    return res.json({ success: true, block });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Get the chain
router.get('/chain', (req, res) => {
  res.json({ chain: bc.chain, length: bc.chain.length });
});

// Validate chain
router.get('/validate', (req, res) => {
  const ok = bc.isChainValid();
  res.json({ valid: ok });
});

// Get results
router.get('/results', (req, res) => {
  const tally = bc.getResults();
  res.json({ results: tally });
});

// Get registered voters (demo only)
router.get('/voters', (req, res) => {
  res.json({ voters: Array.from(bc.voters), voted: Array.from(bc.voted) });
});

module.exports = router;
