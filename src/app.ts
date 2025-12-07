// MODULES
import express, { Request, Response } from 'express'

// LOCAL IMPORTS
import appConfig from './config.js'
import routes from './routes.js'
import { globalErrorsHandler, notFoundHandler } from './utils/errors.js'

// API VERSION
const { apiVersion } = appConfig

// INITIATE APP
const app = express()

// MIDDLEWARES
app.use('/api', express.json())

// CHECK IF API IS RUNNING
app.get('/api', function (req: Request, res: Response) {
  res.json({
    success: true,
    message: 'API is running'
  })
})

// INSERT ROUTES
routes.forEach(function (route) {
  app.use(`/api/${apiVersion}/${route.path}`, route.router)
})

// 404 HANDLER (should come after all routes)
app.use(notFoundHandler)

// GLOBAL ERROR HANDLER (last middleware)
app.use(globalErrorsHandler)

// EXPORTS
export default app
