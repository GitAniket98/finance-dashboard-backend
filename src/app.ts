import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import authRoutes from "./routes/auth.routes"
import { Request, Response, NextFunction } from "express"
import ApiError from "./utils/ApiError"
import userRoutes from "./routes/user.routes"
import recordRoutes from "./routes/record.routes"
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
app.use("/users", userRoutes)
app.use("/records", recordRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "route not found" })
})

// error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    })
  }

  console.error(err)
  return res.status(500).json({
    success: false,
    message: "internal server error",
  })
})

export default app