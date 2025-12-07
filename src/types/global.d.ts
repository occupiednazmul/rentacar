// LOCAL IMPORT
import { JwtPayload } from '../utils/tokens.ts'

// EXPORT
export {}

// GLOBAL TYPESPACE
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
