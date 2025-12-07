// MODULES
import { Request, Response, Router } from 'express'
import { signIn, signUp } from './auth.controller.js'

// AUTH ROUTER
const authRouter = Router()

// POST /api/v1/auth/signup  (Public)
authRouter.post('/signup', signUp)

// POST /api/v1/auth/signin  (Public)
authRouter.post('/signin', signIn)

// EXPORT
export default authRouter
