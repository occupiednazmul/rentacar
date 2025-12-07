// MODULE
import dotenv from 'dotenv'

// INITIATE ENVIRONMENTS
dotenv.config()

// ENVIRONMENTS
const nodeEnv: string = process.env.NODE_ENV || 'development'
const port: number = process.env.PORT ? Number(process.env.PORT) : 8000
const apiVersion: string = process.env.API_VERSION || 'v1'
const databaseUrl = process.env.POSTGRES_URL as string
const jwtSecret = process.env.JWT_SECRET as string
const jwtExpiresIn: number = Number(process.env.JWT_EXPIRES_IN) || 86400
const saltRounds: number = Number(process.env.SALT_ROUNDS) || 10

if (!databaseUrl) {
  throw new Error('Database URL not found!')
}

if (typeof saltRounds !== 'number') {
  throw new Error('Salt rounds must be a number!')
}

// CONFIGURATIONS OBJECT
const appConfig = {
  nodeEnv,
  port,
  apiVersion,
  db: {
    dbUrl: databaseUrl
  },
  jwtSecret,
  jwtExpiresIn,
  saltRounds
}

// EXPORT
export default appConfig
