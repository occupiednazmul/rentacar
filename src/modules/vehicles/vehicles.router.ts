// src/modules/vehicles/vehicles.routes.ts

// MODULES
import { Router } from 'express'

// LOCAL IMPORTS
import { authVerify } from '../../middlewares/auth.middleware.js'
import {
  getAllVehicles,
  createAVehicle,
  updateAVehicle,
  deleteAVehicle
} from './vehicles.controller.js'

// VEHICLES ROUTER
const vehiclesRouter = Router()

// GET /api/v1/vehicles
vehiclesRouter.get('/', getAllVehicles)

// POST /api/v1/vehicles
vehiclesRouter.post('/', authVerify('admin'), createAVehicle)

// PUT /api/v1/vehicles/:vehicleId
vehiclesRouter.put('/:vehicleId', authVerify('admin'), updateAVehicle)

// DELETE /api/v1/vehicles/:vehicleId
vehiclesRouter.delete('/:vehicleId', authVerify('admin'), deleteAVehicle)

// EXPORT
export default vehiclesRouter
