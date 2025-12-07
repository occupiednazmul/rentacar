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

// CREATE TABLES
export async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL CHECK (email = lower(email)),
        password TEXT NOT NULL,
        phone CHAR(11) NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number TEXT UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
        availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked')),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC NOT NULL CHECK (total_price > 0),
        status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    console.log(`DATABASE SHOULD WORK`)
  } catch (error) {
    console.error(`DATABASE COULDN'T CONNECT`, error)
    throw error
  }
}

// EXPORTS
export default pool
