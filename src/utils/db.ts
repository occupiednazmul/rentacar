// MODULES
import { Pool } from 'pg'

// LOCAL IMPORT
import appConfig from '../config.js'

const {
  db: { dbUrl },
  nodeEnv
} = appConfig

// CONNECTION POOL
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: nodeEnv === 'production'
  }
})

// EXPORTS
export default pool
