// MODULES
import pool from '../../utils/db.js'
import { hashPassword, comparePassword } from '../../utils/password.js'
import { signToken } from '../../utils/tokens.js'

// USER ROLE
export type UserRole = 'admin' | 'customer'

// USER ROW EXPOSED TO OUTSIDE (no password)
export type UserRow = {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  created_at: string
}

// REGISTER USER
export async function registerUser(params: {
  name: string
  email: string
  password: string
  phone: string
  role: UserRole
}): Promise<UserRow> {
  const { name, email, password, phone, role } = params

  const hashedPassword = await hashPassword(password)

  const result = await pool.query<UserRow>(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, LOWER($2), $3, $4, $5)
     RETURNING id, name, email, phone, role, created_at`,
    [name, email, hashedPassword, phone, role]
  )

  return result.rows[0]
}

// AUTHENTICATE USER
export async function authenticateUser(params: {
  email: string
  password: string
}): Promise<{ token: string; user: UserRow } | null> {
  const { email, password } = params

  const result = await pool.query<
    UserRow & {
      password: string
    }
  >(`SELECT * FROM users WHERE email = LOWER($1) AND is_active = TRUE`, [email])

  const dbUser = result.rows[0]

  if (!dbUser) {
    return null
  }

  const match = await comparePassword(password, dbUser.password)
  if (!match) {
    return null
  }

  // Build safe user object without password
  const user: UserRow = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role,
    created_at: dbUser.created_at
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role
  })

  return { token, user }
}
