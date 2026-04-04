import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../db"
import asyncHandler from "../utils/AsyncHandler"
import ApiError from "../utils/ApiError"
import ApiResponse from "../utils/ApiResponse"
import { RegisterInput, LoginInput } from "../validators/auth.validator"
import { AuthenticatedUser } from "../models/user.model"

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as RegisterInput

  // check if email already exists
  const existing = await query("SELECT id FROM users WHERE email = $1", [email])
  if (existing.rows.length > 0) {
    throw new ApiError(409, "email already registered")
  }

  // hash password
  const password_hash = await bcrypt.hash(password, 10)

  // insert user
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, status, created_at`,
    [name, email, password_hash, role]
  )

  const user = result.rows[0]

  res.status(201).json(new ApiResponse("user registered successfully", user))
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput

  // find user
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  if (result.rows.length === 0) {
    throw new ApiError(401, "invalid email or password")
  }

  const user = result.rows[0]

  // check if user is active
  if (user.status === "inactive") {
    throw new ApiError(403, "your account has been deactivated")
  }

  // verify password
  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    throw new ApiError(401, "invalid email or password")
  }

  // generate token
  const payload: AuthenticatedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
  expiresIn: "7d",
})

  res.json(new ApiResponse("login successful", { token, user: payload }))
})