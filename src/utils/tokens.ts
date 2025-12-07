// MODULES
import jwt from 'jsonwebtoken'

// LOCAL IMPORTS
import appConfig from '../config.js'

const { jwtSecret, jwtExpiresIn } = appConfig

// JWT PAYLOAD TYPE
export type JwtPayload = {
  id: number
  email: string
  role: 'admin' | 'customer'
}

// CREATE A TOKEN
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn
  })
}

// VERIFY THE TOKEN
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret) as JwtPayload
}
