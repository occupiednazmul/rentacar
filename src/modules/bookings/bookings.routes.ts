// MODULES
import { Request, Response, Router } from 'express'

// USER ROUTER
const bookingsRouter = Router()

// POST /api/v1/bookings  (Customer/Admin)
bookingsRouter.post('/', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Create booking not implemented yet'
  })
})

// GET /api/v1/bookings  (Role-based)
bookingsRouter.get('/', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Get bookings not implemented yet'
  })
})

// PUT /api/v1/bookings/:bookingId  (Role-based)
bookingsRouter.put('/:bookingId', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Update booking not implemented yet'
  })
})

// EXPORT
export default bookingsRouter
