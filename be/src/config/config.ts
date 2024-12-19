import dotenv from 'dotenv'

dotenv.config()

export const Config = {
  DatabaseUrl: process.env.DATABASE_URL,
  Port: process.env.PORT
}
