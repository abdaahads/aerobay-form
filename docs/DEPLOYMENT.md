# Deployment Guide

## Frontend (Vercel)

1. Connect your GitHub repository to Vercel.
2. Create a new project pointing to the `frontend` directory.
3. Vercel should auto-detect Vite.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://aerobay-api.railway.app`)

## Backend (Railway / Render)

### Option A: Railway
1. Create a new project in Railway.
2. Choose "Deploy from GitHub repo".
3. Configure the Root Directory to `backend/`.
4. Railway will auto-detect Node.js and run `npm start`.
5. Add all required Environment Variables (see `.env.example`).
6. Generate a domain for your service. Use this domain as the `VITE_API_BASE_URL` in your frontend.

### Option B: Render
1. Create a new "Web Service" on Render.
2. Connect your repo and set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all Environment Variables.

## Database (Supabase)
Your Supabase instance is already hosted in the cloud. Just ensure that the `SUPABASE_URL` and keys are correctly set in the backend environment variables.
