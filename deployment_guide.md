# Production Deployment Guide

Follow this guide to host the ApexCart full-stack E-Commerce application in a production environment using free cloud-tier providers.

---

## 1. Database Setup: MongoDB Atlas

Since our local setup falls back to JSON file storage, we must provision a real MongoDB cluster to support multiple active users in production.

1.  Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Click **Create a Database** and select the **M0 Free Shared Tier**.
3.  Choose a provider (e.g., AWS) and region close to your target audience.
4.  In the **Security Quickstart**:
    *   Create a Database User: Set a secure username and password. Save these credentials.
    *   Add IP Access List: Set `0.0.0.0/0` (allow access from anywhere) to let the cloud server connect to the database.
5.  Go to the **Database Dashboard**, click **Connect**, select **Drivers**, and copy the connection string. It will look like this:
    ```text
    mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```
6.  Replace `<username>` and `<password>` in the connection string with your database user credentials. This connection string is your production `MONGO_URI`.

---

## 2. Backend Deployment: Render or Railway

You can host the Node/Express backend API on Render (Web Services) or Railway.

### Deploying on Render (Web Service)
1.  Push your code repository to GitHub (include both `backend/` and `frontend/` folders).
2.  Sign in to [Render](https://render.com) and link your GitHub account.
3.  Click **New +** and select **Web Service**.
4.  Connect your repository.
5.  Configure the service settings:
    *   **Name**: `apexcart-api`
    *   **Root Directory**: `backend` (This points Render directly to the backend folder)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  Click **Advanced** to add Environment Variables:
    *   `PORT` = `10000` (Render default or handles automatically)
    *   `NODE_ENV` = `production`
    *   `MONGO_URI` = `mongodb+srv://...` (your MongoDB Atlas connection string)
    *   `JWT_SECRET` = `a_very_long_random_string_for_security`
7.  Click **Create Web Service**. Wait for the logs to say `Server running in production mode` and copy the assigned URL (e.g. `https://apexcart-api.onrender.com`).

---

## 3. Frontend Deployment: Vercel or Netlify

We can host our static Vite React frontend on Vercel.

### Configure Frontend Endpoint
Before deploying the frontend, update your backend base URL in the frontend code.
1.  Open [api.js](file:///C:/Users/HP/.gemini/antigravity/scratch/premium-ecommerce/frontend/src/utils/api.js#L1).
2.  Update the `API_BASE_URL` to point to your live Render API url:
    ```javascript
    const API_BASE_URL = 'https://apexcart-api.onrender.com/api';
    ```

### Deploying on Vercel
1.  Sign in to [Vercel](https://vercel.com) and link your GitHub account.
2.  Click **Add New** and select **Project**.
3.  Import your GitHub repository.
4.  In the project configurations:
    *   **Root Directory**: Select `frontend` (extremely important!)
    *   **Framework Preset**: Select `Vite` (should auto-detect)
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  Under **Build & Development Settings**, add environment variables if any are used, or leave blank since our API base URL is declared statically.
6.  Click **Deploy**. Once Vercel finishes compiling, it will issue a deployment URL (e.g. `https://apexcart.vercel.app`).

---

## 4. Verification Check
- Visit your Vercel URL, register a new account, and check that product listings load.
- Open Chrome DevTools, verify that API requests are routing to your Render instance, and inspect cookies/headers for JWT tokens.
