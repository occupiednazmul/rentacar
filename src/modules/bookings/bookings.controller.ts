// src/modules/bookings/bookings.controller.ts

// MODULES
import { Request, Response, NextFunction } from 'express'

// LOCAL IMPORTS
import { badRequest, unauthorized } from '../../utils/errors.js'
import {
  createBooking,
  getBookingsForAdmin,
  getBookingsForCustomer,
  getBookingWithVehicle,
  cancelBooking,
  markBookingReturned
} from './bookings.services.js'

// CREATE BOOKING
export async function createABooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentUser = req.user

    if (!currentUser) {
      return unauthorized(res, 'Authentication required')
    }

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body

    if (!vehicle_id || !rent_start_date || !rent_end_date || !customer_id) {
      return badRequest(
        res,
        'Missing required fields',
        'customer_id, vehicle_id, rent_start_date, rent_end_date are required'
      )
    }

    const customerIdNum = Number(customer_id)
    const vehicleIdNum = Number(vehicle_id)

    if (Number.isNaN(customerIdNum) || Number.isNaN(vehicleIdNum)) {
      return badRequest(
        res,
        'Invalid customer_id or vehicle_id',
        'customer_id and vehicle_id must be numbers'
      )
    }

    // If customer, enforce own ID
    if (currentUser.role === 'customer') {
      if (currentUser.id !== customerIdNum) {
        return badRequest(
          res,
          'You can only create bookings for your own account',
          'customer_id must match authenticated user'
        )
      }
    }

    // Basic date validation (service also guards)
    if (Number.isNaN(Date.parse(rent_start_date))) {
      return badRequest(
        res,
        'Invalid rent_start_date',
        'rent_start_date must be a valid date'
      )
    }

    if (Number.isNaN(Date.parse(rent_end_date))) {
      return badRequest(
        res,
        'Invalid rent_end_date',
        'rent_end_date must be a valid date'
      )
    }

    const result = await createBooking({
      customerId: customerIdNum,
      vehicleId: vehicleIdNum,
      rentStartDate: rent_start_date,
      rentEndDate: rent_end_date
    })

    const { vehicle, ...booking } = result

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        ...booking,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          daily_rent_price: vehicle.daily_rent_price
        }
      }
    })
  } catch (err) {
    return next(err)
  }
}

// GET BOOKINGS
export async function getAllBookings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentUser = req.user

    if (!currentUser) {
      return unauthorized(res, 'Authentication required')
    }

    if (currentUser.role === 'admin') {
      const rows = await getBookingsForAdmin()

      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: rows.map(function (row) {
          return {
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
              name: row.customer_name,
              email: row.customer_email
            },
            vehicle: {
              vehicle_name: row.vehicle_name,
              registration_number: row.vehicle_registration
            }
          }
        })
      })
    }

    const rows = await getBookingsForCustomer(currentUser.id)

    return res.status(200).json({
      success: true,
      message: 'Your bookings retrieved successfully',
      data: rows.map(function (row) {
        return {
          id: row.id,
          vehicle_id: row.vehicle_id,
          rent_start_date: row.rent_start_date,
          rent_end_date: row.rent_end_date,
          total_price: row.total_price,
          status: row.status,
          vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.vehicle_registration,
            type: row.vehicle_type
          }
        }
      })
    })
  } catch (err) {
    return next(err)
  }
}

// UPDATE BOOKING
export async function updateABooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentUser = req.user

    if (!currentUser) {
      return unauthorized(res, 'Authentication required')
    }

    const bookingId = Number(req.params.bookingId)
    const { status } = req.body

    if (Number.isNaN(bookingId)) {
      return badRequest(res, 'Invalid booking ID', 'bookingId must be a number')
    }

    if (status !== 'cancelled' && status !== 'returned') {
      return badRequest(
        res,
        'Invalid status',
        "Status must be either 'cancelled' or 'returned'"
      )
    }

    const record = await getBookingWithVehicle(bookingId)
    if (!record) {
      return badRequest(res, 'Booking not found', 'Booking does not exist')
    }

    const { booking } = record

    if (currentUser.role === 'customer') {
      if (status !== 'cancelled') {
        return badRequest(
          res,
          'Forbidden',
          'Customers can only cancel their bookings'
        )
      }

      if (booking.customer_id !== currentUser.id) {
        return badRequest(
          res,
          'Forbidden',
          'You can only manage your own bookings'
        )
      }

      if (booking.status !== 'active') {
        return badRequest(
          res,
          'Booking cannot be updated',
          'Only active bookings can be cancelled'
        )
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const startDate = new Date(booking.rent_start_date)

      if (!(today < startDate)) {
        return badRequest(
          res,
          'Booking cannot be cancelled',
          'Booking can only be cancelled before the start date'
        )
      }

      const updated = await cancelBooking(bookingId)
      if (!updated) {
        return badRequest(res, 'Booking not found', 'Booking does not exist')
      }

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          id: updated.id,
          customer_id: updated.customer_id,
          vehicle_id: updated.vehicle_id,
          rent_start_date: updated.rent_start_date,
          rent_end_date: updated.rent_end_date,
          total_price: updated.total_price,
          status: updated.status
        }
      })
    }

    if (currentUser.role === 'admin') {
      if (status !== 'returned') {
        return badRequest(
          res,
          'Invalid status',
          "Admins can only mark bookings as 'returned'"
        )
      }

      if (booking.status !== 'active') {
        return badRequest(
          res,
          'Booking cannot be updated',
          'Only active bookings can be marked as returned'
        )
      }

      const result = await markBookingReturned(bookingId)
      if (!result) {
        return badRequest(res, 'Booking not found', 'Booking does not exist')
      }

      const updated = result.booking

      return res.status(200).json({
        success: true,
        message: 'Booking marked as returned. Vehicle is now available',
        data: {
          id: updated.id,
          customer_id: updated.customer_id,
          vehicle_id: updated.vehicle_id,
          rent_start_date: updated.rent_start_date,
          rent_end_date: updated.rent_end_date,
          total_price: updated.total_price,
          status: updated.status,
          vehicle: {
            availability_status: result.vehicle_availability_status
          }
        }
      })
    }

    return unauthorized(res)
  } catch (err) {
    return next(err)
  }
}
