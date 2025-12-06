// MODULES
import dotenv from 'dotenv'

// INITIATE ENVIRONMENTS
dotenv.config()

// CONFIGURATIONS
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000
}
