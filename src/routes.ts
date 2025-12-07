// MODULES
import { Router } from 'express'

// LOCAL IMPORTS
import userRouter from './modules/users/users.routes.js'
import vehiclesRouter from './modules/vehicles/vehicles.routes.js'
import bookingsRouter from './modules/bookings/bookings.routes.js'

// ROUTES
const routes: Array<{ path: string; router: Router }> = [
  { path: 'users', router: userRouter },
  { path: 'vehicles', router: vehiclesRouter },
  { path: 'bookings', router: bookingsRouter }
]

// EXPORT
export default routes
