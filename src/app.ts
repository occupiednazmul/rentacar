// MODULES
import express from 'express'

// INITIATE APP
const app = express()

// MIDDLEWARES
app.use(express.json())

// EXPORTS
export default app
