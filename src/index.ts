import { pool } from "./db"
import dotenv from "dotenv"
import app from "./app"

dotenv.config()

const PORT = process.env.PORT || 8000

const main = async () => {
    try {
        await pool.connect()
        console.log("database connected..")

        app.listen(PORT, ()=> {
            console.log(`Server listening on port : ${PORT}`)
        })
    } catch (error) {
        console.log("db connection failed", error)
        process.exit(1)
    }
}

main()