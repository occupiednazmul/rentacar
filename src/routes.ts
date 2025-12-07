// MODULES
import { Router } from 'express'

// LOCAL IMPORTS
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/users/users.router.js'
import vehiclesRouter from './modules/vehicles/vehicles.routes.js'
import bookingsRouter from './modules/bookings/bookings.router.js'

// ROUTES
const routes: Array<{ path: string; router: Router }> = [
  { path: 'auth', router: authRouter },
  { path: 'users', router: userRouter },
  { path: 'vehicles', router: vehiclesRouter },
  { path: 'bookings', router: bookingsRouter }
]

// EXPORT
export default routes
