import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: ".env.local" })

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schemas/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
