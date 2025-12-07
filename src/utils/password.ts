// MODULES
import bcrypt from 'bcryptjs'

// LOCAL IMPORTS
import appConfig from '../config.js'

// SALT ROUNDS
const { saltRounds } = appConfig

// HASH PASSWORD
export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(plain, salt)
}

// COMPARE PASSWORD
export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
