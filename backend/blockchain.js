const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class Block {
  constructor(index, timestamp, voterId, candidate, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.voterId = voterId;
    this.candidate = candidate;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data = `${this.index}${this.timestamp}${this.voterId}${this.candidate}${this.previousHash}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

class Blockchain {
  constructor(persistFile) {
    this.chain = [];
    this.voters = new Set(); // registered voters
    this.voted = new Set(); // voters who already voted
    this.persistFile = persistFile || path.join(__dirname, 'data', 'chain.json');
    this._ensureDataDir();
    this._loadFromDisk();
    if (this.chain.length === 0) {
      // genesis block
      const genesis = new Block(0, new Date().toISOString(), 'genesis', 'none', '0');
      this.chain.push(genesis);
      this._saveToDisk();
    }
  }

  _ensureDataDir() {
    const dir = path.dirname(this.persistFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  _loadFromDisk() {
    try {
      if (fs.existsSync(this.persistFile)) {
        const raw = fs.readFileSync(this.persistFile, 'utf8');
        const parsed = JSON.parse(raw);
        // revive blocks
        this.chain = parsed.chain.map(b => Object.assign(new Block(), b));
        this.voters = new Set(parsed.voters || []);
        this.voted = new Set(parsed.voted || []);
      }
    } catch (err) {
      console.warn('Could not load persisted chain:', err.message);
    }
  }

  _saveToDisk() {
    const payload = {
      chain: this.chain,
      voters: Array.from(this.voters),
      voted: Array.from(this.voted)
    };
    fs.writeFileSync(this.persistFile, JSON.stringify(payload, null, 2));
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  registerVoter(voterId) {
    if (!voterId) throw new Error('voterId required');
    if (this.voters.has(voterId)) return false;
    this.voters.add(voterId);
    this._saveToDisk();
    return true;
  }

  hasVoted(voterId) {
    return this.voted.has(voterId);
  }

  addVote(voterId, candidate) {
    if (!this.voters.has(voterId)) throw new Error('voter not registered');
    if (this.voted.has(voterId)) throw new Error('voter already voted');
    const index = this.chain.length;
    const timestamp = new Date().toISOString();
    const previousHash = this.getLatestBlock().hash;
    const block = new Block(index, timestamp, voterId, candidate, previousHash);
    this.chain.push(block);
    this.voted.add(voterId);
    this._saveToDisk();
    return block;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      const recalculated = crypto.createHash('sha256')
        .update(`${current.index}${current.timestamp}${current.voterId}${current.candidate}${current.previousHash}`)
        .digest('hex');
      if (current.hash !== recalculated) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  getResults() {
    const tally = {};
    for (let i = 1; i < this.chain.length; i++) {
      const b = this.chain[i];
      tally[b.candidate] = (tally[b.candidate] || 0) + 1;
    }
    return tally;
  }
}

module.exports = { Blockchain, Block };
