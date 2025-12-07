// LOCAL IMPORTS
import appConfig from './config.js'
import app from './app.js'
import { initDb } from './utils/db.js'

// CONFIGURATION VARIABLES
const {
  port,
  nodeEnv,
  db: { dbUrl }
} = appConfig

// SERVER
async function start() {
  try {
    await initDb()

    app.listen(port, function () {
      console.log(`Server is running on port ${port} in ${nodeEnv} mode`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

// START SERVER
start()
