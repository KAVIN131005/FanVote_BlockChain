const crypto = require('crypto');
const mongoose = require('mongoose');
const { Block, Voter, Results } = require('./models/database');

class MongoBlockchain {
  constructor() {
    this.connectDB();
  }

  async connectDB() {
    try {
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new Error('MONGODB_URI environment variable is required');
      }
      
      await mongoose.connect(mongoURI);
      
      console.log('✅ Connected to MongoDB successfully');
      // Initialize genesis after connection
      await this.initializeGenesis();
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }
  }

  async initializeGenesis() {
    try {
      const existingBlocks = await Block.countDocuments();
      if (existingBlocks === 0) {
        const genesisBlock = new Block({
          index: 0,
          timestamp: new Date().toISOString(),
          data: 'Genesis Block - IPL 2026 Fan Vote Blockchain',
          previousHash: '0',
          hash: this.calculateHash('0', 'Genesis Block - IPL 2026 Fan Vote Blockchain', new Date().toISOString())
        });
        
        await genesisBlock.save();
        console.log('✅ Genesis block created');
      }
    } catch (error) {
      console.error('❌ Genesis block initialization failed:', error.message);
    }
  }

  calculateHash(previousHash, data, timestamp) {
    return crypto
      .createHash('sha256')
      .update(previousHash + data + timestamp)
      .digest('hex');
  }

  async registerVoter(voterId) {
    try {
      const existingVoter = await Voter.findOne({ voterId });
      if (existingVoter) {
        return false; // Already registered
      }

      const newVoter = new Voter({ voterId });
      await newVoter.save();
      console.log(`📝 Voter registered: ${voterId}`);
      return true;
    } catch (error) {
      console.error('❌ Voter registration failed:', error.message);
      throw new Error('Registration failed');
    }
  }

  async addVote(voterId, candidate) {
    try {
      // Check if voter is registered
      const voter = await Voter.findOne({ voterId });
      if (!voter) {
        throw new Error('Voter not registered');
      }

      // Check if voter has already voted
      if (voter.hasVoted) {
        throw new Error('Voter has already cast their vote');
      }

      // Get the latest block
      const latestBlock = await Block.findOne().sort({ index: -1 });
      const newIndex = latestBlock ? latestBlock.index + 1 : 1;

      // Create new block
      const timestamp = new Date().toISOString();
      const blockData = `${voterId}:${candidate}`;
      const hash = this.calculateHash(latestBlock.hash, blockData, timestamp);

      const newBlock = new Block({
        index: newIndex,
        timestamp,
        voterId,
        candidate,
        previousHash: latestBlock.hash,
        hash
      });

      await newBlock.save();

      // Update voter status
      voter.hasVoted = true;
      voter.votedCandidate = candidate;
      voter.votedAt = new Date();
      await voter.save();

      // Update results cache
      await this.updateResults(candidate);

      console.log(`🗳️ Vote recorded: ${voterId} voted for ${candidate}`);
      return newBlock;
    } catch (error) {
      console.error('❌ Vote recording failed:', error.message);
      throw error;
    }
  }

  async updateResults(candidate) {
    try {
      const existingResult = await Results.findOne({ candidate });
      if (existingResult) {
        existingResult.voteCount += 1;
        await existingResult.save();
      } else {
        const newResult = new Results({ candidate, voteCount: 1 });
        await newResult.save();
      }
    } catch (error) {
      console.error('❌ Results update failed:', error.message);
    }
  }

  async getResults() {
    try {
      const results = await Results.find({});
      const resultsObj = {};
      results.forEach(result => {
        resultsObj[result.candidate] = result.voteCount;
      });
      return resultsObj;
    } catch (error) {
      console.error('❌ Get results failed:', error.message);
      return {};
    }
  }

  async getChain() {
    try {
      const blocks = await Block.find({}).sort({ index: 1 });
      return blocks;
    } catch (error) {
      console.error('❌ Get chain failed:', error.message);
      return [];
    }
  }

  async getVoters() {
    try {
      const voters = await Voter.find({});
      const votersList = voters.map(v => v.voterId);
      const votedList = voters.filter(v => v.hasVoted).map(v => v.voterId);
      return { voters: votersList, voted: votedList };
    } catch (error) {
      console.error('❌ Get voters failed:', error.message);
      return { voters: [], voted: [] };
    }
  }

  async isChainValid() {
    try {
      const blocks = await this.getChain();
      
      for (let i = 1; i < blocks.length; i++) {
        const currentBlock = blocks[i];
        const previousBlock = blocks[i - 1];

        // Verify current block hash
        const blockData = currentBlock.data || `${currentBlock.voterId}:${currentBlock.candidate}`;
        const expectedHash = this.calculateHash(currentBlock.previousHash, blockData, currentBlock.timestamp);
        
        if (currentBlock.hash !== expectedHash) {
          return false;
        }

        // Verify chain linkage
        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Chain validation failed:', error.message);
      return false;
    }
  }
}

module.exports = { MongoBlockchain };