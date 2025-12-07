// MODULES
import { NextFunction, Request, Response } from 'express'

// BAD REQUEST
export function badRequest(res: Response, message: string, error: string) {
  return res.status(400).json({
    success: false,
    message,
    error
  })
}

// UNAUTHORIZED ACCESS
export function unauthorized(
  res: Response,
  message = 'Authentication failed',
  error = 'Check your email or password'
) {
  return res.status(401).json({
    success: false,
    message,
    error
  })
}

// 404 NOT FOUND HANDLER
export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  })
}

// GLOBAL ERROR HANDLER
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('GLOBAL ERROR HANDLER:', err)

  const status = err?.statusCode || err?.status || 500
  const message = err?.message || 'Internal server error'

  return res.status(status).json({
    success: false,
    message
  })
}
