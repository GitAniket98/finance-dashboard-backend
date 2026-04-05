import { pool, query } from "./index"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

const seed = async () => {
  try {
    console.log("seeding database...")

    // clear existing data
    await query("TRUNCATE financial_records, users RESTART IDENTITY CASCADE")

    // hash password for all seed users
    const password_hash = await bcrypt.hash("password123", 10)

    // seed users
    await query(
      `INSERT INTO users (name, email, password_hash, role) VALUES
       ($1, $2, $3, 'admin'),
       ($4, $5, $6, 'analyst'),
       ($7, $8, $9, 'viewer')`,
      [
        "Admin User", "admin@finance.com", password_hash,
        "Analyst User", "analyst@finance.com", password_hash,
        "Viewer User", "viewer@finance.com", password_hash,
      ]
    )

    console.log("users seeded")

    // seed financial records
    await query(
      `INSERT INTO financial_records (created_by, amount, type, category, date, notes) VALUES
       (1, 5000.00, 'income', 'salary', '2026-04-01', 'April salary'),
       (1, 2000.00, 'income', 'freelance', '2026-04-05', 'Freelance project'),
       (1, 1500.00, 'expense', 'rent', '2026-04-01', 'April rent'),
       (1, 500.00, 'expense', 'food', '2026-04-03', 'Groceries'),
       (1, 3000.00, 'income', 'salary', '2026-03-01', 'March salary'),
       (1, 800.00, 'expense', 'utilities', '2026-03-10', 'Electricity and water'),
       (1, 1200.00, 'income', 'freelance', '2026-03-20', 'Design work'),
       (1, 300.00, 'expense', 'food', '2026-03-25', 'Restaurant')`
    )

    console.log("financial records seeded")
    console.log("seeding complete")
    console.log("-----------------------------")
    console.log("test accounts:")
    console.log("admin@finance.com / password123 (admin)")
    console.log("analyst@finance.com / password123 (analyst)")
    console.log("viewer@finance.com / password123 (viewer)")

    process.exit(0)
  } catch (error) {
    console.error("seeding failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()