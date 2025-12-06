export {}

declare global {
  namespace Express {
    interface UserPayload {
      id: string
      role: 'admin' | 'customer'
    }

    interface Request {
      user?: UserPayload
    }
  }
}
