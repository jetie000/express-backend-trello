import { config } from "dotenv"

config()

export const configMy = {
  DATABASE_URL: process.env.DATABASE_URL,
  API_URL: process.env.API_URL || "http://localhost:8080",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD
}
