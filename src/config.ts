// MODULE
import dotenv from 'dotenv'

// INITIATE ENVIRONMENTS
dotenv.config()

// ENVIRONMENTS
const nodeEnv = process.env.NODE_ENV || 'development'
const port = process.env.PORT ? Number(process.env.PORT) : 8000
const apiVersion = process.env.API_VERSION || 'v1'
const databaseUrl = process.env.POSTGRES_URL

if (!databaseUrl) {
  throw new Error('Database URL not found!')
}

// CONFIGURATIONS OBJECT
const appConfig = {
  nodeEnv,
  port,
  apiVersion,
  db: {
    dbUrl: databaseUrl
  }
}

// EXPORT
export default appConfig
