// MODULES
import { Request, Response, NextFunction } from 'express'

// LOCAL IMPORTS
import {
  getAllVehicles,
  createVehicle,
  updateVehicleById,
  hasActiveBookingsForVehicle,
  deleteVehicleById
} from './vehicles.services.js'
import { badRequest } from '../../utils/errors.js'

// GET VEHICLES
export async function getVehicles(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const vehicles = await getAllVehicles()

    return res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles
    })
  } catch (err) {
    return next(err)
  }
}

// CREATE VEHICLE
export async function createVehicleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    } = req.body

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      daily_rent_price === undefined ||
      !availability_status
    ) {
      return badRequest(
        res,
        'Missing required fields for vehicle creation',
        'vehicle_name, type, registration_number, daily_rent_price, availability_status are required'
      )
    }

    const priceNumber = Number(daily_rent_price)
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      return badRequest(
        res,
        'Invalid daily rent price',
        'daily_rent_price must be a positive number'
      )
    }

    const vehicle = await createVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price: priceNumber,
      availability_status
    })

    return res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    })
  } catch (err) {
    return next(err)
  }
}

// UPDATE VEHICLE
export async function updateVehicleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idParam = Number(req.params.vehicleId)
    if (Number.isNaN(idParam)) {
      return badRequest(
        res,
        'Invalid vehicle ID',
        'Vehicle ID must be a number'
      )
    }

    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      is_active
    } = req.body

    if (
      vehicle_name === undefined &&
      type === undefined &&
      registration_number === undefined &&
      daily_rent_price === undefined &&
      availability_status === undefined &&
      is_active === undefined
    ) {
      return badRequest(
        res,
        'No fields provided to update',
        'At least one field is required to update vehicle'
      )
    }

    const updates: any = {}

    if (vehicle_name !== undefined) updates.vehicle_name = vehicle_name
    if (type !== undefined) updates.type = type
    if (registration_number !== undefined)
      updates.registration_number = registration_number
    if (daily_rent_price !== undefined) {
      const priceNumber = Number(daily_rent_price)
      if (Number.isNaN(priceNumber) || priceNumber <= 0) {
        return badRequest(
          res,
          'Invalid daily rent price',
          'daily_rent_price must be a positive number'
        )
      }
      updates.daily_rent_price = priceNumber
    }
    if (availability_status !== undefined)
      updates.availability_status = availability_status
    if (is_active !== undefined) updates.is_active = Boolean(is_active)

    const updated = await updateVehicleById(idParam, updates)

    if (!updated) {
      return badRequest(res, 'Vehicle not found', 'Vehicle does not exist')
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updated
    })
  } catch (err) {
    return next(err)
  }
}

// DELETE VEHICLE
export async function deleteVehicleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idParam = Number(req.params.vehicleId)
    if (Number.isNaN(idParam)) {
      return badRequest(
        res,
        'Invalid vehicle ID',
        'Vehicle ID must be a number'
      )
    }

    // Cannot delete if vehicle has active bookings
    const active = await hasActiveBookingsForVehicle(idParam)
    if (active) {
      return badRequest(
        res,
        'Vehicle cannot be deleted because it has active bookings',
        'Active bookings exist for this vehicle'
      )
    }

    const deleted = await deleteVehicleById(idParam)

    if (!deleted) {
      return badRequest(res, 'Vehicle not found', 'Vehicle does not exist')
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    })
  } catch (err) {
    return next(err)
  }
}
