import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import authRoutes from "./routes/auth.routes"
import { success } from "zod"

const app = express()

// security headers
app.use(helmet())

//cors
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods : ["GET", "POST", "PATCH", "DELETE"]
}))

// rateLimit
const limiter = rateLimit({
    windowMs : 15*60*1000,
    max : 100,
    message : {success : false, message : "Too many requests, try again later"}
})

app.use(limiter)

// body parser
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit : "16kb"}))

// health check
app.get("/health", (req, res) => {
    res.json({success : true, message : "server is live and running"})
})

// routes
app.use("/auth", authRoutes)

export default app