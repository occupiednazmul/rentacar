// MODULE
import dotenv from 'dotenv'

// INITIATE ENVIRONMENTS
dotenv.config()

// ENVIRONMENTS
const nodeEnv = process.env.NODE_ENV || 'development'
const port = process.env.PORT ? Number(process.env.PORT) : 8000

// CONFIGURATIONS OBJECT
const appConfig = {
  nodeEnv,
  port
}

// EXPORT
export default appConfig
