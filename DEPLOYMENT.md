# Render Deployment Guide: Environment Variables

To ensure your frontend and backend communicate correctly on Render, follow these steps to set up your environment variables.

## 1. Backend Service (Web Service)
**Backend URL**: `https://la-bistro.onrender.com/`

1. Go to your **Backend Service** in the Render Dashboard.
2. Click on **Environment** in the left sidebar.
3. Add the following variables:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `PORT` | `5000` | (Optional, Render sets this automatically) |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:5174,https://la-bistro-frontend.onrender.com` | Allows local development (ports 5173/5174) AND your deployed frontend. |
| `DATABASE_URL` | `your_postgresql_connection_string` | Your production database URL. |
| `JWT_SECRET` | `your_long_random_secret_key` | Make it secure! |
| `NODE_ENV` | `production` | |

---

## 2. Frontend Service (Static Site)
**Frontend URL**: `https://la-bistro-frontend.onrender.com/`

> [!IMPORTANT]
> Since this is a Vite project, environment variables are **baked into the build**. You MUST set these in Render **before** you trigger a build/deploy.

1. Go to your **Frontend Service** in the Render Dashboard.
2. Click on **Environment** in the left sidebar.
3. Add the following variable:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://la-bistro.onrender.com` | **DO NOT** include `/api` at the end. |

4. After adding the variable, go to **Deployments** and click **Manual Deploy** -> **Clear Cache & Deploy** to ensure the new variable is baked into the build.

---

## Summary of How It Works
- **Local Dev**: Frontend uses `http://localhost:5000` (from `.env`). Backend allows `http://localhost:5173` (from `.env`).
- **Production**: Frontend uses `https://la-bistro.onrender.com` (from Render Env). Backend allows `https://la-bistro-frontend.onrender.com` (from Render Env).

No code changes are needed when switching between environments!
