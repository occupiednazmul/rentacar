// LOCAL IMPORTS
import appConfig from './config.js'
import app from './app.js'

// CONFIGURATION VARIABLES
const { port, nodeEnv } = appConfig

// RUN APP
app.listen(port, function () {
  console.log(`Server is running on port ${port} in ${nodeEnv} mode`)
})
