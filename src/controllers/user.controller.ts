import { Request, Response } from "express"
import { query } from "../db"
import asyncHandler from "../utils/AsyncHandler"
import ApiError from "../utils/ApiError"
import ApiResponse from "../utils/ApiResponse"
import { UpdateUserInput } from "../validators/user.validator"
import { AuthenticatedUser } from "../models/user.model"

interface AuthRequest extends Request {
  user?: AuthenticatedUser
}

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT id, name, email, role, status, created_at 
     FROM users 
     ORDER BY created_at DESC`,
  )

  res.json(new ApiResponse("users fetched successfully", result.rows))
})

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const result = await query(
    `SELECT id, name, email, role, status, created_at 
     FROM users WHERE id = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    throw new ApiError(404, "user not found")
  }

  res.json(new ApiResponse("user fetched successfully", result.rows[0]))
})

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }
  const { role, status } = req.body as UpdateUserInput

  const existing = await query("SELECT id FROM users WHERE id = $1", [id])
  if (existing.rows.length === 0) {
    throw new ApiError(404, "user not found")
  }

  if (req.user?.id === parseInt(id) && status === "inactive") {
    throw new ApiError(400, "you cannot deactivate your own account")
  }

  const fields: string[] = []
  const values: unknown[] = []
  let index = 1

  if (role) {
    fields.push(`role = $${index++}`)
    values.push(role)
  }

  if (status) {
    fields.push(`status = $${index++}`)
    values.push(status)
  }

  fields.push(`updated_at = NOW()`)
  values.push(id)

  const result = await query(
    `UPDATE users SET ${fields.join(", ")} 
     WHERE id = $${index} 
     RETURNING id, name, email, role, status`,
    values
  )

  res.json(new ApiResponse("user updated successfully", result.rows[0]))
})