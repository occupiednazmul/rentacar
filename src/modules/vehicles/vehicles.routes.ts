// MODULES
import { Request, Response, Router } from 'express'

// USER ROUTER
const vehiclesRouter = Router()

// POST /api/v1/vehicles  (Admin only)
vehiclesRouter.post('/', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Create vehicle not implemented yet'
  })
})

// GET /api/v1/vehicles  (Public)
vehiclesRouter.get('/', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Get all vehicles not implemented yet'
  })
})

// GET /api/v1/vehicles/:vehicleId  (Public)
vehiclesRouter.get('/:vehicleId', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Get vehicle by id not implemented yet'
  })
})

// PUT /api/v1/vehicles/:vehicleId  (Admin only)
vehiclesRouter.put('/:vehicleId', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Update vehicle not implemented yet'
  })
})

// DELETE /api/v1/vehicles/:vehicleId  (Admin only)
vehiclesRouter.delete('/:vehicleId', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Delete vehicle not implemented yet'
  })
})

// EXPORT
export default vehiclesRouter
