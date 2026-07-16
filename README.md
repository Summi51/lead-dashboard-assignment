# Lead Dashboard Assignment

A full-stack Lead Management Dashboard application where users can login, manage leads, search, filter, update, delete and export lead data.

## Live Demo

Frontend:
https://lead-dashboard-assignment.vercel.app/

Backend API:
https://lead-dashboard-assignment.onrender.com/api


---

# Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API
- LocalStorage for JWT session management


## Backend
- Node.js
- Express.js
- JWT Authentication
- CORS
- dotenv


---

# Project Structure

```
lead-dashboard-assignment

│
├── frontend
│   ├── index.html
│   ├── dashboard.html
│   ├── css
│   │   └── style.css
│   │
│   └── js
│       ├── api.js
│       ├── auth.js
│       └── dashboard.js
│
│
└── backend
    ├── index.js
    ├── routes
    │   ├── auth.js
    │   └── leads.js
    │
    ├── package.json
    └── .env
```

---

# Features

## Authentication
- Admin login using JWT authentication
- Secure API requests with Bearer token
- Session handling using LocalStorage


## Lead Management

Users can:

- Add new leads
- Edit existing leads
- Delete leads
- View lead details
- View lead summary statistics


## Search & Filters

Supported filters:

- Search by name
- Search by phone number
- Filter by status
- Filter by unit type
- Sort latest/oldest leads


## Export

- Export lead data as CSV file


---

# Login Credentials

```
Email:
admin@futeservices.com

Password:
admin123
```

---

# Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```
PORT=8000
JWT_SECRET=your_secret_key
```

Run server:

```bash
npm start
```

Backend will start:

```
http://localhost:8000
```

---

# API Documentation

Base URL:

```
https://lead-dashboard-assignment.onrender.com/api
```

---

# Authentication API

## Login

POST

```
/login
```

Request:

```json
{
 "email":"admin@futeservices.com",
 "password":"admin123"
}
```

Response:

```json
{
 "token":"JWT_TOKEN"
}
```

---

# Lead APIs

## Get All Leads

GET

```
/leads
```


## Create Lead

POST

```
/leads
```

Example:

```json
{
"name":"Amit Sharma",
"email":"amit@gmail.com",
"phone":"9876543211",
"property":"Palm Residency",
"unitType":"2 BHK",
"budget":"80 Lakhs",
"source":"Website",
"status":"New",
"notes":"Interested buyer",
"followUpDate":"2026-07-25"
}
```


## Update Lead

PUT

```
/leads/:id
```


## Delete Lead

DELETE

```
/leads/:id
```


## Summary Statistics

GET

```
/leads/summary/stats
```


## Export CSV

GET

```
/leads/export/csv
```

---

# Deployment

## Frontend Deployment

Deployed on:

Vercel

Build Type:

Static Website

Root Directory:

```
frontend
```

Publish Directory:

```
.
```


## Backend Deployment

Deployed on:

Render

Configuration:

Root Directory:

```
backend
```

Build Command:

```
npm install
```

Start Command:

```
npm start
```

Environment Variables:

```
PORT
JWT_SECRET
```

---

# API Security

Protected routes require:

```
Authorization: Bearer YOUR_TOKEN
```

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

# Author

Samreen Inayat

Full Stack Developer
