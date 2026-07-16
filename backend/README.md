# Lead Dashboard Backend API Documentation

## Base URL

```text
http://localhost:8000/api
```

---

# Authentication

## Login

**POST** `/login`

http://localhost:8000/api/login

### Request Body

```json
{
  "email": "admin@futeservices.com",
  "password": "admin123"
}
```

### Response

Returns a JWT token.

Use this token in all protected APIs.

```
Authorization: Bearer YOUR_TOKEN
```

---

# Health Check

## Check Server Status

**GET** `/health`

**URL**

```text
http://localhost:8000/api/health
```

---

# Leads APIs

> **Headers (Required for all protected APIs)**

```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

## 1. Get All Leads

**GET** `/leads`

**URL**

```text
http://localhost:8000/api/leads
```

---

## 2. Get Lead By ID

**GET** `/leads/:id`

Example

```text
http://localhost:8000/api/leads/1
```

---

## 3. Create New Lead

**POST** `/leads`

**URL**

```text
http://localhost:8000/api/leads
```

### Request Body

```json
{
  "name": "Amit Sharma",
  "email": "amit@gmail.com",
  "phone": "9876543211",
  "property": "Palm Residency",
  "unitType": "2 BHK",
  "budget": "80 Lakhs",
  "source": "Website",
  "status": "New",
  "notes": "Interested buyer",
  "followUpDate": "2026-07-25"
}
```

---

## 4. Update Lead

**PUT** `/leads/:id`

Example

```text
http://localhost:8000/api/leads/1
```

### Request Body

```json
{
  "status": "Contacted",
  "budget": "85 Lakhs",
  "notes": "Customer called today"
}
```

---

## 5. Delete Lead

**DELETE** `/leads/:id`

Example

```text
http://localhost:8000/api/leads/1
```

---

## 6. Lead Summary

**GET** `/leads/summary/stats`

**URL**

```text
http://localhost:8000/api/leads/summary/stats
```

---

## 7. Export Leads as CSV

**GET** `/leads/export/csv`

**URL**

```text
http://localhost:8000/api/leads/export/csv
```

---

# Search APIs

## Search by Name

```text
GET /leads?search=Ravi
```

Example

```text
http://localhost:8000/api/leads?search=Shifa
```

---

## Search by Phone Number

```text
GET /leads?search=9876543210
```

Example

```text
http://localhost:8000/api/leads?search=9876543211
```

---

# Filter APIs

## Filter by Status

### New

```text
http://localhost:8000/api/leads?status=New
```

### Contacted

```text
http://localhost:8000/api/leads?status=Contacted
```

### Site Visit Scheduled

```text
http://localhost:8000/api/leads?status=Site%20Visit%20Scheduled
```

### Closed

```text
http://localhost:8000/api/leads?status=Closed
```

### Lost

```text
http://localhost:8000/api/leads?status=Lost
```

---

## Filter by Unit Type

### 2 BHK

```text
http://localhost:8000/api/leads?unitType=2%20BHK
```

### 3 BHK

```text
http://localhost:8000/api/leads?unitType=3%20BHK
```

### Villa

```text
http://localhost:8000/api/leads?unitType=Villa
```

---

# Sorting APIs

## Latest First

```text
http://localhost:8000/api/leads?sort=desc
```

---

## Oldest First

```text
http://localhost:8000/api/leads?sort=asc
```

---

# Combined Filters

Search + Status + Unit Type + Sort

```text
http://localhost:8000/api/leads?search=Ravi&status=New&unitType=2%20BHK&sort=desc
```

---

# Authorization Header

Include the following header in every protected API request:

```text
Authorization: Bearer YOUR_TOKEN
```

---

# API Summary

| Method | Endpoint                                 | Description                      |            |
| ------ | ---------------------------------------- | -------------------------------- | ---------- |
| POST   | `/login`                                 | Login and get JWT token          |            |
| GET    | `/health`                                | Health check                     |            |
| GET    | `/leads`                                 | Get all leads                    |            |
| GET    | `/leads/:id`                             | Get lead by ID                   |            |
| POST   | `/leads`                                 | Create new lead                  |            |
| PUT    | `/leads/:id`                             | Update lead                      |            |
| DELETE | `/leads/:id`                             | Delete lead                      |            |
| GET    | `/leads/summary/stats`                   | Get dashboard statistics         |            |
| GET    | `/leads/export/csv`                      | Export leads to CSV              |            |
| GET    | `/leads?search=value`                    | Search leads                     |            |
| GET    | `/leads?status=value`                    | Filter by status                 |            |
| GET    | `/leads?unitType=value`                  | Filter by unit type              |            |
| GET    | `/leads?sort=asc                         | desc`                            | Sort leads |
| GET    | `/leads?search=&status=&unitType=&sort=` | Combined search, filter and sort |            |
