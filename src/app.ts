// MODULES
import express, { Router } from 'express'

// LOCAL IMPORTS
import appConfig from './config.js'
import routes from './routes.js'

// API VERSION
const { apiVersion } = appConfig

// INITIATE APP
const app = express()

// MIDDLEWARES
app.use('/api', express.json())

// INSERT ROUTES
routes.forEach(function (route) {
  app.use(`/api/${apiVersion}/${route.path}`, route.router)
})

// EXPORTS
export default app
