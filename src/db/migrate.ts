import fs from "fs"
import path from "path"
import { pool } from "./index"
import dotenv from "dotenv"

dotenv.config()

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, "migrations")
  const files = fs.readdirSync(migrationsDir).sort()

  try {
    const client = await pool.connect()

    for (const file of files) {
      if (!file.endsWith(".sql")) continue
      console.log(`running migration: ${file}`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8")
      await client.query(sql)
      console.log(`done: ${file}`)
    }

    client.release()
    console.log("all migrations completed")
    process.exit(0)
  } catch (error) {
    console.error("migration failed:", error)
    process.exit(1)
  }
}

runMigrations()