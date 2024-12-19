import app from './app'
import { Config } from './config/config'

app.listen(Config.Port, () => {
  console.log(`Started be service. Listening to port ${Config.Port}`)
})

