# Rent A Car API

Backend API for a vehicle rental system with authentication, role-based access (admin/customer), vehicles inventory, and bookings management.

## Features
- JWT authentication with bcrypt password hashing
- Admin and customer role permissions enforced in middleware
- Vehicles CRUD with availability tracking
- Bookings with price calculation and vehicle status updates
- Users management with safeguards against deleting records that have active bookings
- Auto table creation on startup (via `initDb`)
- Fully typed TypeScript codebase, bundled with `tsup`

## Tech Stack
- Node.js + TypeScript (ESM, NodeNext)
- Express 5
- PostgreSQL (via `pg`)
- JWT (`jsonwebtoken`) and `bcryptjs`

## Getting Started
### Prerequisites
- Node.js 20+ (targets `node24` in tsup)
- PostgreSQL database URL

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` in the project root:
```
NODE_ENV=development
PORT=8000
API_VERSION=v1
POSTGRES_URL=postgres://user:password@host:5432/dbname
JWT_SECRET=replace_me
JWT_EXPIRES_IN=86400
SALT_ROUNDS=10
```

### Run
- Dev (watch): `npm run dev`
- Build: `npm run build`
- Start (build then run): `npm start`

On boot the app will create the `users`, `vehicles`, and `bookings` tables if they do not exist.

## API
- Base URL: `/api`
- Versioned prefix: `/api/v1`
- Routes mount: `auth`, `users`, `vehicles`, `bookings`

For full request/response specs see `API_REFERENCE.md`. Highlights:

| Method | Endpoint | Access | Notes |
| ------ | -------- | ------ | ----- |
| POST | `/api/v1/auth/signup` | Public | Register user |
| POST | `/api/v1/auth/signin` | Public | Login, receive JWT |
| GET | `/api/v1/vehicles` | Public | List vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Vehicle detail |
| POST | `/api/v1/vehicles` | Admin | Create vehicle |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete vehicle (no active bookings) |
| GET | `/api/v1/users` | Admin | List users |
| PUT | `/api/v1/users/:userId` | Admin/Own | Update profile/role |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user (no active bookings) |
| POST | `/api/v1/bookings` | Admin/Customer | Create booking, auto price & status |
| GET | `/api/v1/bookings` | Role-based | Admin sees all, customer sees own |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Customer cancel, admin mark returned |

## Project Structure
```
src/
  app.ts            // Express app setup
  index.ts          // Server entry, DB init
  config.ts         // Env config
  middlewares/      // Auth middleware
  modules/
    auth/           // Auth routes/controllers/services
    users/          // User management
    vehicles/       // Vehicle inventory
    bookings/       // Booking logic
  utils/            // DB, errors, tokens, password helpers
  types/            // Global typings
```

## Deployment
- Build artifacts output to `api/`
- `vercel.json` rewrites `/api/*` to `/api` for Vercel serverless hosting

## Troubleshooting
- Ensure `POSTGRES_URL` is reachable and SSL settings align with your environment.
- JWT issues: confirm `JWT_SECRET` matches the token issuer, and `Authorization: Bearer <token>` header is present on protected routes.
- If tables are missing, restart the server to trigger `initDb`.
