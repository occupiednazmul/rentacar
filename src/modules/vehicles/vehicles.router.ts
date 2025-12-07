// src/modules/vehicles/vehicles.routes.ts

// MODULES
import { Router } from 'express'

// LOCAL IMPORTS
import { authVerify } from '../../middlewares/auth.middleware.js'
import {
  getVehicles,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController
} from './vehicles.controller.js'

// VEHICLES ROUTER
const vehiclesRouter = Router()

// GET /api/v1/vehicles
vehiclesRouter.get('/', getVehicles)

// POST /api/v1/vehicles
vehiclesRouter.post('/', authVerify('admin'), createVehicleController)

// PUT /api/v1/vehicles/:vehicleId
vehiclesRouter.put('/:vehicleId', authVerify('admin'), updateVehicleController)

// DELETE /api/v1/vehicles/:vehicleId
vehiclesRouter.delete(
  '/:vehicleId',
  authVerify('admin'),
  deleteVehicleController
)

// EXPORT
export default vehiclesRouter
