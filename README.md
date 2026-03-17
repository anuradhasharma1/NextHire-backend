#  NextHire REST API

A backend REST API for a NextHire platform built with **Node.js**, **Express**, and **MongoDB**. Supports two user roles — **candidates** and **companies** — with JWT-based authentication and full job application management.

---

##  Features

-  **JWT Authentication** — Secure register & login with role-based access control
-  **Company Role** — Post jobs, view applicants, and update application statuses
-  **Candidate Role** — Browse jobs and apply with duplicate-application prevention
-  **Application Tracking** — Status lifecycle: `pending → accepted / rejected`
-  **Protected Routes** — Middleware-based token verification on all sensitive endpoints

---

##  Tech Stacks

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Config | dotenv |

---

## Project Structure

```
├── models/
│   ├── User.js            
│   ├── Job.js              
│   └── Application.js      
├── routes/
│   ├── authRoutes.js      
│   ├── jobRoutes.js        
│   └── applicationRoutes.js
├── middleware/
│   └── verifyToken.js    
└── main.js              
```

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/NextHire-api.git
cd NextHire-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `SECRET_KEY` | Secret used to sign JWT tokens |

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register as candidate or company | ❌ |
| POST | `/login` | Login and receive JWT token | ❌ |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "candidate"
}
```

**Login response:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "John Doe", "role": "candidate" }
}
```

---

### Jobs — `/api/jobs`

| Method | Endpoint | Description | Auth Required | Role |
|---|---|---|---|---|
| GET | `/` | Get all job listings | ❌ | Any |
| GET | `/:id` | Get a single job | ❌ | Any |
| POST | `/` | Post a new job | ✅ | Company |
| DELETE | `/:id` | Delete a job | ✅ | Company (owner only) |

---

### Applications — `/api/applications`

| Method | Endpoint | Description | Auth Required | Role |
|---|---|---|---|---|
| POST | `/:id/apply` | Apply for a job | ✅ | Candidate |
| GET | `/mine` | View my applications | ✅ | Candidate |
| GET | `/:id/applicants` | View applicants for a job | ✅ | Company |
| PUT | `/:id/status` | Update application status | ✅ | Company |

**Update status body:**
```json
{ "status": "accepted" }
```
> Valid values: `pending`, `accepted`, `rejected`

---


##  License

This project is open source and available under the [MIT License](LICENSE).
