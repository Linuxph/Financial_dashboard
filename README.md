# Finance Data Processing and Access Control Dashboard

A production-style backend API for managing financial records, role-based access, and dashboard analytics.

**Tech Stack**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Swagger UI (OpenAPI 3)

## Architecture (Short)
- **Controllers** handle HTTP request/response and delegate to services.
- **Services** contain business logic and DB operations.
- **Models** define Mongoose schemas.
- **Middleware** handles auth, roles, validation, logging, and errors.
- **Utils** keep shared helpers clean and reusable.

## Folder Structure
- controllers/
- models/
- routes/
- middleware/
- services/
- utils/
- config/
- db/
- errors/
- types/

## Setup
1. Create a `.env` file based on `.env.example`.
2. Install dependencies: `npm install`
3. Run in dev: `npm run dev`
4. Build & run: `npm run build` then `npm start`

## API Docs (Swagger)
- `GET /api/docs` (Swagger UI)

## Access Control Rules
- viewer: read-only (records)
- analyst: read + dashboard analytics
- admin: full access (users + records + analytics)

## API Endpoints

### Auth
- `POST /api/auth/register` (public)
- `POST /api/auth/login` (public)

### Users (admin only)
- `GET /api/users`
- `PATCH /api/users/:userId/deactivate`

### Records
- `GET /api/records` (viewer, analyst, admin)
- `POST /api/records` (admin only)
- `PATCH /api/records/:recordId` (admin only)
- `DELETE /api/records/:recordId` (admin only)

### Dashboard
- `GET /api/dashboard` (analyst, admin)

## Filters & Pagination (Records)
Query params:
- `type=income|expense`
- `category=Salary`
- `startDate=2026-01-01`
- `endDate=2026-12-31`
- `page=1`
- `limit=10`

## Sample Postman Requests

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Anita Verma",
  "email": "anita@demo.com",
  "password": "secret123",
  "role": "admin"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "anita@demo.com",
  "password": "secret123"
}
```

### Get Users (Admin)
```
GET /api/users
Authorization: Bearer <token>
```

### Create Record (Admin)
```
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1200,
  "type": "income",
  "category": "Salary",
  "date": "2026-03-01",
  "notes": "March salary"
}
```

### List Records (All Roles)
```
GET /api/records?type=expense&category=Food&startDate=2026-01-01&endDate=2026-12-31&page=1&limit=10
Authorization: Bearer <token>
```

### Update Record (Admin)
```
PATCH /api/records/RECORD_ID
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Updated note"
}
```

### Delete Record (Admin)
```
DELETE /api/records/RECORD_ID
Authorization: Bearer <token>
```

### Dashboard Summary (Analyst/Admin)
```
GET /api/dashboard
Authorization: Bearer <token>
```

## Response Shape
```
{
  "success": true,
  "message": "...",
  "data": {}
}
```
