// LOCAL IMPORTS
import { config } from './config.js'
import app from './app.js'

// PORT
const port = config.port

// RUN APP
app.listen(port, function () {
  console.log(`Server is running on port ${port} in ${config.nodeEnv} mode`)
})
