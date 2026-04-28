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

## Troubleshooting: "Network Error" or "500 Internal Server Error"

If your frontend shows but backend data doesn't load:

### 1. Check the Health Endpoint
Open `https://la-bistro.onrender.com/api/health` in your browser.
- If it says `database: disconnected`, your `DATABASE_URL` is wrong.
- If it doesn't load at all, your Backend service might be crashed.

### 2. Common Causes for 500 Error:
- **Database Connection**: Ensure the `DATABASE_URL` in your Backend environment variables is correct. If you are using Render PostgreSQL, use the **Internal Database URL**.
- **Prisma Migrations**: You must run migrations on your production database. 
  - In Render, change your **Build Command** for the backend to:
    `npm install && npx prisma generate && npx prisma migrate deploy`
- **CORS**: Make sure `CORS_ORIGIN` does NOT have a trailing slash.
  - Correct: `https://la-bistro-frontend.onrender.com`
  - Incorrect: `https://la-bistro-frontend.onrender.com/`

### 3. Check Render Logs
Go to your **Backend Service** -> **Logs** in Render. Look for lines starting with `Error:` or `PrismaClientInitializationError`.
