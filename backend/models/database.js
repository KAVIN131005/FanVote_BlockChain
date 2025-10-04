const mongoose = require('mongoose');

// Block schema for blockchain
const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  timestamp: { type: String, required: true },
  data: { type: String }, // For genesis block
  voterId: { type: String }, // For vote blocks
  candidate: { type: String }, // For vote blocks
  previousHash: { type: String, required: true },
  hash: { type: String, required: true }
}, { timestamps: true });

// Voter schema to track registrations and votes
const voterSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  hasVoted: { type: Boolean, default: false },
  votedCandidate: { type: String, default: null },
  registeredAt: { type: Date, default: Date.now },
  votedAt: { type: Date, default: null }
}, { timestamps: true });

// Results cache schema for faster queries
const resultsSchema = new mongoose.Schema({
  candidate: { type: String, required: true, unique: true },
  voteCount: { type: Number, default: 0 }
}, { timestamps: true });

const Block = mongoose.model('Block', blockSchema);
const Voter = mongoose.model('Voter', voterSchema);
const Results = mongoose.model('Results', resultsSchema);

module.exports = { Block, Voter, Results };