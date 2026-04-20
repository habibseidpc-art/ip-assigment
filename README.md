# 🌾 Agricultural Extension & Crop Advisory System

A full-stack MERN application connecting farmers with agricultural extension officers.

## Tech Stack
- **Frontend:** React 18, React Router v6, Axios, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas for production)
- **Auth:** JWT (JSON Web Tokens)

---

## Run Locally

### 1. Backend
```bash
cd backend
npm install
node server.js
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000

---

## Deploy to Production (Free)

### Step 1 — MongoDB Atlas (Database)
1. Go to https://mongodb.com/atlas and create a free account
2. Create a free M0 cluster
3. Click Connect → get your connection string:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/agricultural_system`
4. Save this string — you'll need it for Render

### Step 2 — Render (Backend)
1. Go to https://render.com and sign up with GitHub
2. Click New Web Service → connect this repo
3. Set Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = any long random string
   - `JWT_EXPIRE` = 7d
7. Deploy → copy your Render URL (e.g. https://your-app.onrender.com)

### Step 3 — Vercel (Frontend)
1. Go to https://vercel.com and sign up with GitHub
2. Click Add New Project → import this repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render URL from Step 2
5. Deploy → your app is live!

---

## Roles
- **Farmer** — submit crop problems, track requests, view advice
- **Extension Officer** — view all requests, provide advice, update status, view analytics
