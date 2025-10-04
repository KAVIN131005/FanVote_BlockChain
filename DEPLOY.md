Deploying FanVote (frontend -> Vercel, backend -> Render)

Overview
- Frontend: Vite + React app located in `frontend/`
- Backend: Node.js + Express located in `backend/`

Frontend (Vercel)
1. Create a new Vercel project and connect your GitHub repo `KAVIN131005/FanVote_BlockChain`.
2. In Vercel, set the root directory to the repository root and the build command to:
   - Install: `npm install --prefix frontend`
   - Build: `npm run build --prefix frontend`
   You can set the Vercel "Build Command" to:

   npm install --prefix frontend && npm run build --prefix frontend

3. Set "Output Directory" to `frontend/dist`.
4. Add an environment variable (if your backend will be on Render):
   - Key: `VITE_API_BASE`
   - Value: `https://<your-render-service>.onrender.com/api`
5. Deploy. Vercel will build `frontend` and serve static assets.

Backend (Render)
1. Create a new Web Service on Render and connect the repo `KAVIN131005/FanVote_BlockChain`.
2. Choose the `main` branch and set the root directory to `backend` (or let build command run in the root with `npm install --prefix backend`).
3. Set the Build Command: `npm install --prefix backend`
4. Set the Start Command: `npm start --prefix backend` or `npm --prefix backend start`.
5. Render sets a `PORT` environment variable automatically. The backend already uses `process.env.PORT || 3000`.
6. Deploy. After deployment, copy the service URL and use it in Vercel's `VITE_API_BASE`.

Notes & Quick Tips
- If you prefer to host both frontend and backend on Render, you can create two services (one static site for frontend and one web service for backend) and point the frontend's API base to the backend's Render URL.
- For local development, keep `VITE_API_BASE` unset; the frontend will default to `http://localhost:3000/api`.
- Ensure `backend/data/` is in `.gitignore` (already ignored) to avoid committing runtime data.

Troubleshooting
- If your backend fails to start due to port conflicts locally, stop the process that uses port 3000 or run the backend with `PORT=3001 npm start`.
- On Windows cmd.exe use: `set PORT=3001 && npm start --prefix backend`

Contact
- If you'd like, I can generate a Dockerfile for both services and a `docker-compose.yml` for a single command deploy.
