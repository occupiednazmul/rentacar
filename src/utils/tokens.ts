// MODULES
import jwt from 'jsonwebtoken'

// LOCAL IMPORTS
import appConfig from '../config.js'

const { jwtSecret, jwtExpiresIn } = appConfig

export type JwtPayload = {
  id: number
  email: string
  role: 'admin' | 'customer'
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn
  })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret) as JwtPayload
}
