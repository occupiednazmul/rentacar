// LOCAL IMPORTS
import pool from '../../utils/db.js'

// VEHICLE SUMMARY
export type VehicleSummary = {
  id: number
  vehicle_name: string
  type: 'car' | 'bike' | 'van' | 'SUV'
  registration_number: string
  daily_rent_price: number
  availability_status: 'available' | 'booked'
  is_active: boolean
}

// GET ALL VEHICLES
export async function getAllVehicles(): Promise<VehicleSummary[]> {
  const result = await pool.query<VehicleSummary>(
    `SELECT
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        is_active
     FROM vehicles
     ORDER BY id ASC`
  )

  return result.rows
}

// GET SINGLE VEHICLE
export async function getVehicleById(
  vehicleId: number
): Promise<VehicleSummary | null> {
  const result = await pool.query<VehicleSummary>(
    `SELECT
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        is_active
     FROM vehicles
     WHERE id = $1`,
    [vehicleId]
  )

  return result.rows[0] || null
}

// CREATE VEHICLE
export async function createVehicle(params: {
  vehicle_name: string
  type: 'car' | 'bike' | 'van' | 'SUV'
  registration_number: string
  daily_rent_price: number
  availability_status: 'available' | 'booked'
}): Promise<VehicleSummary> {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
  } = params

  const result = await pool.query<VehicleSummary>(
    `INSERT INTO vehicles (
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        is_active`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    ]
  )

  return result.rows[0]
}

// UPDATE VEHICLE
export async function updateVehicleById(
  vehicleId: number,
  fields: Partial<
    Pick<
      VehicleSummary,
      | 'vehicle_name'
      | 'type'
      | 'registration_number'
      | 'daily_rent_price'
      | 'availability_status'
      | 'is_active'
    >
  >
): Promise<VehicleSummary | null> {
  const updates: string[] = []
  const values: any[] = []
  let index = 1

  if (fields.vehicle_name !== undefined) {
    updates.push(`vehicle_name = $${index++}`)
    values.push(fields.vehicle_name)
  }

  if (fields.type !== undefined) {
    updates.push(`type = $${index++}`)
    values.push(fields.type)
  }

  if (fields.registration_number !== undefined) {
    updates.push(`registration_number = $${index++}`)
    values.push(fields.registration_number)
  }

  if (fields.daily_rent_price !== undefined) {
    updates.push(`daily_rent_price = $${index++}`)
    values.push(fields.daily_rent_price)
  }

  if (fields.availability_status !== undefined) {
    updates.push(`availability_status = $${index++}`)
    values.push(fields.availability_status)
  }

  if (fields.is_active !== undefined) {
    updates.push(`is_active = $${index++}`)
    values.push(fields.is_active)
  }

  if (updates.length === 0) {
    return null
  }

  updates.push(`updated_at = NOW()`)

  const query = `
    UPDATE vehicles
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      is_active
  `

  values.push(vehicleId)

  const result = await pool.query<VehicleSummary>(query, values)
  return result.rows[0] || null
}

// CHECK ACTIVE BOOKINGS FOR VEHICLE
export async function hasActiveBookingsForVehicle(
  vehicleId: number
): Promise<boolean> {
  const result = await pool.query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1
      FROM bookings
      WHERE vehicle_id = $1
        AND status = 'active'
    ) AS exists
  `,
    [vehicleId]
  )

  return result.rows[0]?.exists || false
}

// DELETE VEHICLE
export async function deleteVehicleById(vehicleId: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
    vehicleId
  ])

  return result.rowCount === 1
}
