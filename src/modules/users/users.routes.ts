// MODULES
import { Request, Response, Router } from 'express'

// USER ROUTER
const userRouter = Router()

// GET /api/v1/users  (Admin only)
userRouter.get('/', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Get all users not implemented yet'
  })
})

// PUT /api/v1/users/:userId  (Admin or own)
userRouter.put('/:userId', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Update user not implemented yet'
  })
})

// DELETE /api/v1/users/:userId  (Admin only)
userRouter.delete('/:userId', (req: Request, res: Response) => {
  // TODO: replace with controller
  res.status(501).json({
    success: false,
    message: 'Delete user not implemented yet'
  })
})

// EXPORT
export default userRouter
