// MODULES
import { NextFunction, Response, Request } from 'express'

// LOCAL IMPORTS
import { verifyToken, JwtPayload } from '../utils/tokens.js'
import { unauthorized } from '../utils/errors.js'

// Role Type
type Role = JwtPayload['role']

// AUTHENTICATION VERIFY
export function authVerify(allowedRoles?: Role | Role[]) {
  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles
    : allowedRoles
    ? [allowedRoles]
    : undefined

  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Authentication token missing')
    }

    const token = authHeader.split(' ')[1]

    try {
      const payload = verifyToken(token)
      req.user = payload

      if (!rolesArray) {
        return next()
      }

      if (!rolesArray.includes(payload.role)) {
        return unauthorized(res, 'You are not allowed to access this resource')
      }

      return next()
    } catch (err) {
      return unauthorized(res, 'Invalid or expired token')
    }
  }
}
