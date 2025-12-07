// src/modules/bookings/bookings.router.ts

// MODULES
import { Router } from 'express'

// LOCAL IMPORTS
import { authVerify } from '../../middlewares/auth.middleware.js'
import {
  createABooking,
  getAllBookings,
  updateABooking
} from './bookings.controller.js'

// BOOKINGS ROUTER
const bookingsRouter = Router()

// POST /api/v1/bookings  (Customer or Admin)
bookingsRouter.post('/', authVerify(['admin', 'customer']), createABooking)

// GET /api/v1/bookings  (Role-based)
bookingsRouter.get('/', authVerify(['admin', 'customer']), getAllBookings)

// PUT /api/v1/bookings/:bookingId  (Role-based)
bookingsRouter.put(
  '/:bookingId',
  authVerify(['admin', 'customer']),
  updateABooking
)

// EXPORT
export default bookingsRouter
