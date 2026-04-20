# 🌾 Agricultural Extension & Crop Advisory System

A full-stack MERN application connecting farmers with extension officers for agricultural advisory services.

## Project Structure

```
agricultural-system/
├── backend/          # Node.js + Express + MongoDB API
└── frontend/         # React application
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)
- npm

---

## Setup & Run

### 1. Backend

```bash
cd agricultural-system/backend
npm install
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend

```bash
cd agricultural-system/frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## API Endpoints

| Method | Endpoint                        | Role    | Description              |
|--------|---------------------------------|---------|--------------------------|
| POST   | /api/auth/register              | Public  | Register new user        |
| POST   | /api/auth/login                 | Public  | Login and get JWT token  |
| GET    | /api/auth/me                    | Any     | Get current user         |
| POST   | /api/requests                   | Farmer  | Submit farming problem   |
| GET    | /api/requests/my                | Farmer  | View own requests        |
| GET    | /api/requests                   | Officer | View all requests        |
| PUT    | /api/requests/:id/advise        | Officer | Provide advice           |
| PUT    | /api/requests/:id/status        | Officer | Update request status    |
| GET    | /api/dashboard                  | Officer | Get dashboard stats      |

---

## Features

### Farmer
- Register and login
- Submit farming problems (crop type, description, farm size)
- Track request status: Pending → In Progress → Solved
- View advice received from extension officers

### Extension Officer
- View all farmer requests with status filter
- Provide advice (recommendations, fertilizer, pest control)
- Update request status
- Analytics dashboard with charts (Pie + Bar)
- Stats: Total Farmers, Active Requests, Solved Cases
