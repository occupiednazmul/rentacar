# Rent A Car API

Backend for managing vehicle rentals with JWT auth, role-based access (admin/customer), vehicle inventory, and bookings with automatic price and availability updates.

- Live API: https://localrentacar.vercel.app/api  
- GitHub repo: https://github.com/occupiednazmul/rentacar

## Tech Stack
- Node.js + TypeScript (ESM)
- Express 5
- PostgreSQL (pg)
- JWT (jsonwebtoken) and bcryptjs
- Bundled with tsup

## Environment Setup (create `.env` before running or deploying)
Create a `.env` in the project root with the required values:
```
NODE_ENV=development
PORT=8000
API_VERSION=v1
POSTGRES_URL=postgres://user:password@host:5432/dbname
JWT_SECRET=replace_me
JWT_EXPIRES_IN=86400
SALT_ROUNDS=10
```
- For local dev, keep `NODE_ENV=development`.  
- For deployment, use production values (new `JWT_SECRET`, production `POSTGRES_URL`, desired `PORT`).

## Local Development
1) Install: `npm install`  
2) Run dev (watch): `npm run dev`  
3) Build: `npm run build` (outputs to `api/`)  
4) Start built bundle: `npm start`

The app auto-creates the `users`, `vehicles`, and `bookings` tables on startup if they do not exist.

## Local Testing Guide
- No automated tests are shipped; use Postman/cURL.  
- Example sanity checks (adjust `PORT` as needed):
  - Health: `curl http://localhost:8000/api`  
  - Sign up: `curl -X POST http://localhost:8000/api/v1/auth/signup -H "Content-Type: application/json" -d '{"name":"John","email":"john@example.com","password":"secret123","phone":"01712345678","role":"customer"}'`
  - Sign in: `curl -X POST http://localhost:8000/api/v1/auth/signin -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"secret123"}'`
  - Authenticated calls: include `Authorization: Bearer <jwt>` header.

## Routes and Expected Results
All responses follow the structures in `API_REFERENCE.md`.

- Auth
  - `POST /api/v1/auth/signup` → 201, returns created user (id, name, email, phone, role).
  - `POST /api/v1/auth/signin` → 200, returns JWT token and user.
- Vehicles
  - `GET /api/v1/vehicles` → 200, list of vehicles (or empty list with “No vehicles found”).
  - `GET /api/v1/vehicles/:vehicleId` → 200 with vehicle; 404 if not found.
  - `POST /api/v1/vehicles` (admin) → 201 with created vehicle.
  - `PUT /api/v1/vehicles/:vehicleId` (admin) → 200 with updated vehicle.
  - `DELETE /api/v1/vehicles/:vehicleId` (admin) → 200 on delete; 400 if active bookings block deletion.
- Users
  - `GET /api/v1/users` (admin) → 200 list of users.
  - `PUT /api/v1/users/:userId` (admin or own) → 200 with updated user; 403 if customer edits another user.
  - `DELETE /api/v1/users/:userId` (admin) → 200 on delete; 400 if active bookings block deletion.
- Bookings
  - `POST /api/v1/bookings` (customer/admin) → 201 with booking and vehicle price info.
  - `GET /api/v1/bookings` (role-based) → admin sees all; customer sees own.
  - `PUT /api/v1/bookings/:bookingId` (role-based) → customer can cancel active future bookings; admin can mark active bookings as returned; auto-updates vehicle availability.

## Deployment (Vercel)
- `vercel.json` rewrites `/api/*` to `/api`, so no extra routing setup is needed.
- Steps:
  1) Set the same env vars in Vercel (`POSTGRES_URL`, `JWT_SECRET`, etc.).  
  2) Deploy with `npm run deploy` (uses `vercel --prod`) or connect the GitHub repo to Vercel for auto-deploys.  
  3) Vercel will build (`tsup`) and serve the bundled API from the `api/` output.

## Submission Checklist
- Live deployment link included (see above).
- GitHub repository link included.
- README documents features, setup, env requirements, routes, and deployment steps as required by the submission guide.
