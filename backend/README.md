# VoteChain Backend

Simple Express backend that implements a demo blockchain for votes.

Endpoints:
- POST /api/register { voterId }
- POST /api/vote { voterId, candidate }
- GET /api/chain
- GET /api/validate
- GET /api/results

Run:
1. cd backend
2. npm install
3. npm run dev   # requires nodemon or use npm start
