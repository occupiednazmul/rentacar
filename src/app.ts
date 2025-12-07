// MODULES
import express, { Request, Response } from 'express'

// INITIATE APP
const app = express()

// MIDDLEWARES
app.use('/api', express.json())

// TEST ROUTE
app.get('/api', function (req: Request, res: Response) {
  res.json({
    message: 'App is working properly'
  })
})

// EXPORTS
export default app
