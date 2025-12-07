// MODULES
import { Router } from 'express'

// LOCAL IMPORTS
import { authVerify } from '../../middlewares/auth.middleware.js'
import { getUsers, updateUser, deleteUser } from './users.controller.js'

// USER ROUTER
const userRouter = Router()

// GET /api/v1/users
userRouter.get('/', authVerify('admin'), getUsers)

// PUT /api/v1/users/:userId
userRouter.put('/:userId', authVerify(['admin', 'customer']), updateUser)

// DELETE /api/v1/users/:userId
userRouter.delete('/:userId', authVerify('admin'), deleteUser)

// EXPORT
export default userRouter
