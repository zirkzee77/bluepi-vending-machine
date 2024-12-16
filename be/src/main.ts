import express, { Request, Response } from 'express'
import { Config } from './config/config'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send("Hello world!")
})

app.listen(Config.Port, () => {
  console.log(`Listening to port ${Config.Port}`)
})
