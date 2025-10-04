const express = require('express');
const router = express.Router();
const { MongoBlockchain } = require('../mongoBlockchain');

// Initialize MongoDB blockchain
const bc = new MongoBlockchain();

// Register a voter
router.post('/register', async (req, res) => {
  const { voterId } = req.body || {};
  if (!voterId) return res.status(400).json({ error: 'voterId required' });
  try {
    const ok = await bc.registerVoter(voterId);
    return res.json({ success: ok, message: ok ? 'registered' : 'already registered' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Cast a vote
router.post('/vote', async (req, res) => {
  const origin = req.get('origin') || 'no-origin'
  console.log(`[VOTE DEBUG] origin=${origin} body=${JSON.stringify(req.body)}`)

  const { voterId, candidate } = req.body || {};
  if (!voterId || !candidate) return res.status(400).json({ error: 'voterId and candidate required' });
  try {
    const block = await bc.addVote(voterId, candidate);
    return res.json({ success: true, block });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Get the chain
router.get('/chain', async (req, res) => {
  try {
    const chain = await bc.getChain();
    res.json({ chain, length: chain.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate chain
router.get('/validate', async (req, res) => {
  try {
    const ok = await bc.isChainValid();
    res.json({ valid: ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get results
router.get('/results', async (req, res) => {
  try {
    const tally = await bc.getResults();
    res.json({ results: tally });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get registered voters (demo only)
router.get('/voters', async (req, res) => {
  try {
    const votersData = await bc.getVoters();
    res.json(votersData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
