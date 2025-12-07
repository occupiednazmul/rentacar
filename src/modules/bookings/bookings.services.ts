// LOCAL IMPORTS
import pool from '../../utils/db.js'

// BOOKING STATUS TYPE
export type BookingStatus = 'active' | 'cancelled' | 'returned'

// BOOKING INFORMATION
export type BookingRow = {
  id: number
  customer_id: number
  vehicle_id: number
  rent_start_date: string
  rent_end_date: string
  total_price: number
  status: BookingStatus
  created_at?: string
  updated_at?: string
}

// NEW BOOKING RESPONSE TYPE
export type BookingWithVehicleForCreate = BookingRow & {
  vehicle: {
    vehicle_name: string
    daily_rent_price: number
  }
}

// ADMIN VIEW BOOKING INFORMATION
export type AdminBookingRow = {
  id: number
  customer_id: number
  vehicle_id: number
  rent_start_date: string
  rent_end_date: string
  total_price: number
  status: BookingStatus
  customer_name: string
  customer_email: string
  vehicle_name: string
  vehicle_registration: string
}

// CUSTOMER VIEW BOOKING INFORMATION
export type CustomerBookingRow = {
  id: number
  vehicle_id: number
  rent_start_date: string
  rent_end_date: string
  total_price: number
  status: BookingStatus
  vehicle_name: string
  vehicle_registration: string
  vehicle_type: string
}

// CREATE BOOKING
export async function createBooking(params: {
  customerId: number
  vehicleId: number
  rentStartDate: string
  rentEndDate: string
}): Promise<BookingWithVehicleForCreate> {
  const { customerId, vehicleId, rentStartDate, rentEndDate } = params

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const vehicleRes = await client.query<{
      id: number
      vehicle_name: string
      daily_rent_price: number
      availability_status: string
    }>(
      `
      SELECT id, vehicle_name, daily_rent_price, availability_status
      FROM vehicles
      WHERE id = $1
      FOR UPDATE
    `,
      [vehicleId]
    )

    if (vehicleRes.rowCount === 0) {
      throw {
        status: 400,
        message: 'Vehicle not found'
      }
    }

    const vehicle = vehicleRes.rows[0]

    if (vehicle.availability_status !== 'available') {
      throw {
        status: 400,
        message: 'Vehicle is not available for booking'
      }
    }

    const start = new Date(rentStartDate)
    const end = new Date(rentEndDate)

    const msPerDay = 1000 * 60 * 60 * 24
    const diffMs = end.getTime() - start.getTime()
    const numberOfDays = Math.floor(diffMs / msPerDay)

    if (Number.isNaN(numberOfDays) || numberOfDays <= 0) {
      throw {
        status: 400,
        message: 'rent_end_date must be after rent_start_date'
      }
    }

    const totalPrice = Number(vehicle.daily_rent_price) * numberOfDays

    const bookingRes = await client.query<BookingRow>(
      `
      INSERT INTO bookings (
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING
        id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        created_at,
        updated_at
    `,
      [customerId, vehicleId, rentStartDate, rentEndDate, totalPrice]
    )

    await client.query(
      `
      UPDATE vehicles
      SET availability_status = 'booked',
          updated_at = NOW()
      WHERE id = $1
    `,
      [vehicleId]
    )

    await client.query('COMMIT')

    const booking = bookingRes.rows[0]

    return {
      ...booking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: Number(vehicle.daily_rent_price)
      }
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// GET BOOKINGS FOR ADMIN
export async function getBookingsForAdmin(): Promise<AdminBookingRow[]> {
  const result = await pool.query<AdminBookingRow>(
    `
    SELECT
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name AS vehicle_name,
      v.registration_number AS vehicle_registration
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id ASC
  `
  )

  return result.rows
}

// GET BOOKINGS FOR CUSTOMER
export async function getBookingsForCustomer(
  customerId: number
): Promise<CustomerBookingRow[]> {
  const result = await pool.query<CustomerBookingRow>(
    `
    SELECT
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name AS vehicle_name,
      v.registration_number AS vehicle_registration,
      v.type AS vehicle_type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id ASC
  `,
    [customerId]
  )

  return result.rows
}

// GET SINGLE BOOKING + VEHICLE
export async function getBookingWithVehicle(bookingId: number): Promise<{
  booking: BookingRow
  vehicle: { id: number; availability_status: string }
} | null> {
  const result = await pool.query<
    BookingRow & { vehicle_id: number; vehicle_availability_status: string }
  >(
    `
    SELECT
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      b.created_at,
      b.updated_at,
      v.availability_status AS vehicle_availability_status
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1
  `,
    [bookingId]
  )

  if (result.rowCount === 0) return null

  const row = result.rows[0]

  const booking: BookingRow = {
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at
  }

  return {
    booking,
    vehicle: {
      id: row.vehicle_id,
      availability_status: row.vehicle_availability_status
    }
  }
}

// CANCEL BOOKING
export async function cancelBooking(
  bookingId: number
): Promise<BookingRow | null> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Get booking to know vehicle_id
    const bookingRes = await client.query<BookingRow>(
      `
      SELECT
        id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        created_at,
        updated_at
      FROM bookings
      WHERE id = $1
      FOR UPDATE
    `,
      [bookingId]
    )

    if (bookingRes.rowCount === 0) {
      await client.query('ROLLBACK')
      return null
    }

    const booking = bookingRes.rows[0]

    const updatedBookingRes = await client.query<BookingRow>(
      `
      UPDATE bookings
      SET status = 'cancelled',
          updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        created_at,
        updated_at
    `,
      [bookingId]
    )

    await client.query(
      `
      UPDATE vehicles
      SET availability_status = 'available',
          updated_at = NOW()
      WHERE id = $1
    `,
      [booking.vehicle_id]
    )

    await client.query('COMMIT')

    return updatedBookingRes.rows[0]
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// MARK BOOKING RETURNED
export async function markBookingReturned(bookingId: number): Promise<{
  booking: BookingRow
  vehicle_availability_status: string
} | null> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const bookingRes = await client.query<BookingRow>(
      `
      SELECT
        id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        created_at,
        updated_at
      FROM bookings
      WHERE id = $1
      FOR UPDATE
    `,
      [bookingId]
    )

    if (bookingRes.rowCount === 0) {
      await client.query('ROLLBACK')
      return null
    }

    const booking = bookingRes.rows[0]

    const updatedBookingRes = await client.query<BookingRow>(
      `
      UPDATE bookings
      SET status = 'returned',
          updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        created_at,
        updated_at
    `,
      [bookingId]
    )

    await client.query(
      `
      UPDATE vehicles
      SET availability_status = 'available',
          updated_at = NOW()
      WHERE id = $1
    `,
      [booking.vehicle_id]
    )

    const vehicleAvailabilityRes = await client.query<{
      availability_status: string
    }>(
      `
      SELECT availability_status
      FROM vehicles
      WHERE id = $1
    `,
      [booking.vehicle_id]
    )

    await client.query('COMMIT')

    return {
      booking: updatedBookingRes.rows[0],
      vehicle_availability_status:
        vehicleAvailabilityRes.rows[0]?.availability_status ?? 'available'
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// AUTOMATIC RETURN OF OVERDUE BOOKINGS
export async function autoReturnOverdueBookings(): Promise<void> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const overdue = await client.query<{
      id: number
      vehicle_id: number
    }>(`
      SELECT id, vehicle_id
      FROM bookings
      WHERE status = 'active'
        AND rent_end_date < CURRENT_DATE
      FOR UPDATE
    `)

    if (overdue.rowCount === 0) {
      await client.query('COMMIT')
      return
    }

    const bookingIds = overdue.rows.map(function (row) {
      return row.id
    })
    const vehicleIds = overdue.rows.map(function (row) {
      return row.vehicle_id
    })

    await client.query(
      `
      UPDATE bookings
      SET status = 'returned',
          updated_at = NOW()
      WHERE id = ANY($1::int[])
    `,
      [bookingIds]
    )

    await client.query(
      `
      UPDATE vehicles
      SET availability_status = 'available',
          updated_at = NOW()
      WHERE id = ANY($1::int[])
    `,
      [vehicleIds]
    )

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
