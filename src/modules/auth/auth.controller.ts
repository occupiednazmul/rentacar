// MODULES
import { NextFunction, Request, Response } from 'express'

// LOCAL IMPORTS
import { badRequest, unauthorized } from '../../utils/errors.js'
import { registerUser, authenticateUser, UserRole } from './auth.services.js'

// SIGN UP
export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, phone, role } = req.body

    if (!name || !email || !password || !phone || !role) {
      return badRequest(
        res,
        'Missing required fields',
        'name, email, password, phone, role are required'
      )
    }

    const user = await registerUser({
      name,
      email,
      password,
      phone,
      role: role as UserRole
    })

    return res.status(201).json({
      success: true,
      data: user
    })
  } catch (err) {
    return next(err)
  }
}

// SIGN IN
export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return badRequest(
        res,
        'Missing email or password',
        'Both email and password are required'
      )
    }

    const authResult = await authenticateUser({ email, password })

    if (!authResult) {
      return unauthorized(res)
    }

    const { token, user } = authResult

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      }
    })
  } catch (err) {
    return next(err)
  }
}
