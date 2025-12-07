// MODULES
import { Request, Response, NextFunction } from 'express'

// LOCAL IMPORTS
import {
  getAllUsers,
  updateUserById,
  hasActiveBookings,
  deleteUserById
} from './users.services.js'
import { badRequest, unauthorized } from '../../utils/errors.js'

// GET USERS
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getAllUsers()

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    })
  } catch (err) {
    return next(err)
  }
}

// UPDATE USER
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idParam = Number(req.params.userId)
    if (Number.isNaN(idParam)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
        errors: 'User ID must be a number'
      })
    }

    const currentUser = req.user
    if (!currentUser) {
      return unauthorized(
        res,
        'Authentication required',
        'Missing user in request'
      )
    }

    const { name, email, phone, role } = req.body

    if (
      name === undefined &&
      email === undefined &&
      phone === undefined &&
      role === undefined
    ) {
      return badRequest(
        res,
        'No fields provided to update',
        'At least one field is required'
      )
    }

    const updates: any = {}

    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email
    if (phone !== undefined) updates.phone = phone

    if (currentUser.role === 'admin') {
      if (role !== undefined) updates.role = role
    } else {
      if (currentUser.id !== idParam) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own profile',
          errors: 'Forbidden'
        })
      }
    }

    const updated = await updateUserById(idParam, updates)

    if (!updated) {
      return badRequest(res, 'User not found', 'User does not exist')
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updated
    })
  } catch (err) {
    return next(err)
  }
}

// DELETE USER
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idParam = Number(req.params.userId)
    if (Number.isNaN(idParam)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
        errors: 'User ID must be a number'
      })
    }

    // Cannot delete if user has active bookings
    const active = await hasActiveBookings(idParam)
    if (active) {
      return badRequest(
        res,
        'User cannot be deleted because they have active bookings',
        'Active bookings exist for this user'
      )
    }

    const deleted = await deleteUserById(idParam)

    if (!deleted) {
      return badRequest(res, 'User not found', 'User does not exist')
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (err) {
    return next(err)
  }
}
