import dotenv from 'dotenv'

dotenv.config()

export const Config: Record<string, string | undefined> = {
  DatabaseUrl: process.env.DATABASE_URL,
  Port: process.env.PORT
}
