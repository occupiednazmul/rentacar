// LOCAL IMPORTS
import pool from '../../utils/db.js'
import type { UserRole } from '../auth/auth.services.js'

// USER SUMMARY
export type UserSummary = {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
}

// GET ALL USERS
export async function getAllUsers(): Promise<UserSummary[]> {
  const result = await pool.query<UserSummary>(
    `SELECT id, name, email, phone, role
     FROM users
     ORDER BY id ASC`
  )

  return result.rows
}

// GET SINGLE USER
export async function getUserById(userId: number): Promise<UserSummary | null> {
  const result = await pool.query<UserSummary>(
    `SELECT id, name, email, phone, role
     FROM users
     WHERE id = $1`,
    [userId]
  )

  return result.rows[0] || null
}

// UPDATE USER
export async function updateUserById(
  userId: number,
  fields: Partial<Pick<UserSummary, 'name' | 'email' | 'phone' | 'role'>>
): Promise<UserSummary | null> {
  const updates: string[] = []
  const values: any[] = []
  let index = 1

  if (fields.name !== undefined) {
    updates.push(`name = $${index++}`)
    values.push(fields.name)
  }

  if (fields.email !== undefined) {
    updates.push(`email = LOWER($${index++})`)
    values.push(fields.email)
  }

  if (fields.phone !== undefined) {
    updates.push(`phone = $${index++}`)
    values.push(fields.phone)
  }

  if (fields.role !== undefined) {
    updates.push(`role = $${index++}`)
    values.push(fields.role)
  }

  if (updates.length === 0) {
    return null
  }

  updates.push(`updated_at = NOW()`)

  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
  `

  values.push(userId)

  const result = await pool.query<UserSummary>(query, values)
  return result.rows[0] || null
}

// CHECK ACTIVE BOOKINGS FOR USER
export async function hasActiveBookings(userId: number): Promise<boolean> {
  const result = await pool.query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1
      FROM bookings
      WHERE customer_id = $1
        AND status = 'active'
    ) AS exists
  `,
    [userId]
  )

  return result.rows[0]?.exists || false
}

// DELETE USER
export async function deleteUserById(userId: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId])

  return result.rowCount === 1
}
