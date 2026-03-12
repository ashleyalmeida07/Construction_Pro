# Construction API

A REST API for managing construction projects and daily progress reports. Built with Node.js, Express, MySQL, and JWT auth.

---

## Stack

- **Node.js + Express** — server and routing
- **MySQL** — database (via `mysql2`)
- **Sequelize** — ORM, handles table creation automatically on startup
- **JWT** — authentication tokens
- **bcryptjs** — password hashing

---

## Project Structure

```
construction-api/
├── config/
│   └── database.js          # Sequelize connection (supports DATABASE_URL or individual vars)
├── controllers/
│   ├── authController.js    # register + login
│   ├── projectController.js
│   └── dprController.js
├── middleware/
│   └── auth.js              # JWT verification + role checking
├── models/
│   ├── User.js
│   ├── Project.js
│   └── DailyReport.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   └── dpr.js
├── schema.sql               # manual SQL if you prefer not to use Sequelize sync
├── server.js
├── .env.example
└── postman_collection.json
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database

In MySQL:

```sql
CREATE DATABASE construction_db;
```

Or run the included schema directly:

```bash
mysql -u root -p < schema.sql
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=construction_db
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
```

### 4. Run the server

```bash
npm run dev    # with auto-restart (nodemon)
npm start      # normal run
```

Server runs at `http://localhost:3000`. Sequelize will create any missing tables on first start.

---

## Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create a new user |
| POST | `/auth/login` | No | Login, returns JWT token |

### Projects

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/projects` | any | List all projects |
| GET | `/projects/:id` | any | Get one project + its DPRs |
| POST | `/projects` | admin, manager | Create a project |
| PUT | `/projects/:id` | admin, manager | Update a project |
| DELETE | `/projects/:id` | admin | Delete a project |

### Daily Progress Reports

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/projects/:id/dpr` | Yes | Submit a daily report |
| GET | `/projects/:id/dpr` | Yes | List reports for a project |
| DELETE | `/projects/:id/dpr/:dprId` | Yes | Delete a report (owner or admin) |

---

## Example Requests

Postman collection is included: `postman_collection.json`

Or open it directly: [View in Postman](https://web.postman.co/workspace/My-Workspace~d2e32bca-568a-482b-8380-41ba2a9d05f9/collection/44526722-d6581111-5b23-44fe-9e8e-f5a9abac0a16?action=share&source=copy-link&creator=44526722)

**Register**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Ashley", "email": "ashley@example.com", "password": "pass123", "role": "admin"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ashley@example.com", "password": "pass123"}'
```

Copy the `token` from the response and use it in the header for protected routes:

**Create a project**
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name": "Bridge Project", "start_date": "2026-03-01", "status": "active"}'
```

**Submit a daily report**
```bash
curl -X POST http://localhost:3000/projects/1/dpr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"date": "2026-03-12", "work_description": "Foundation poured", "weather": "Sunny", "worker_count": 20}'
```

**Filter projects by status**
```bash
curl "http://localhost:3000/projects?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Auth Flow

1. Register with name, email, password, and role (`worker`, `manager`, or `admin`)
2. Login returns a JWT token — store it client-side
3. Send it on every protected request: `Authorization: Bearer <token>`
4. The token carries your `id`, `email`, and `role` — role-restricted routes check this before proceeding
