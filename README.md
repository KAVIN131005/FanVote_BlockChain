# VoteChain

VoteChain is a demo blockchain-based voting system. This repository contains two projects:

- backend — Express API that implements a simple blockchain where each vote is a block.
- frontend — React + Vite + Tailwind frontend to register voters, cast votes and view results.

Quick start:

1. Start backend
   cd backend
   npm install
   npm run dev

2. Start frontend
   cd frontend
   npm install
   npm run dev

Open the frontend at http://localhost:5173 and the backend at http://localhost:3000

Deployment
----------
Recommended setup:

- Frontend -> Vercel (static site): set the build command to `npm install --prefix frontend && npm run build --prefix frontend` and set the Output Directory to `frontend/dist`.
- Backend -> Render (web service): point the service root to `backend`, build with `npm install --prefix backend` and start with `npm start --prefix backend`. Render will provide a `PORT` environment variable automatically.

Make sure to add the following environment variable in Vercel:
- `VITE_API_BASE` = `https://<your-backend-service>.onrender.com/api`

See `DEPLOY.md` for a full step-by-step guide.
