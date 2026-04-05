import { Request, Response } from "express"
import { query } from "../db"
import asyncHandler from "../utils/AsyncHandler"
import ApiError from "../utils/ApiError"
import ApiResponse from "../utils/ApiResponse"
import { AuthenticatedUser } from "../models/user.model"
import { CreateRecordInput, UpdateRecordInput, RecordFilterInput } from "../validators/record.validator"

interface AuthRequest extends Request {
  user?: AuthenticatedUser
}

export const createRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount, type, category, date, notes } = req.body as CreateRecordInput

  const result = await query(
    `INSERT INTO financial_records (created_by, amount, type, category, date, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [req.user!.id, amount, type, category, date, notes || null]
  )

  res.status(201).json(new ApiResponse("record created successfully", result.rows[0]))
})

export const getRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, category, from, to, page, limit } = (req as any).parsedQuery as RecordFilterInput

  const conditions: string[] = ["is_deleted = FALSE"]
  const values: unknown[] = []
  let index = 1

  if (type) {
    conditions.push(`type = $${index++}`)
    values.push(type)
  }

  if (category) {
    conditions.push(`category ILIKE $${index++}`)
    values.push(`%${category}%`)
  }

  if (from) {
    conditions.push(`date >= $${index++}`)
    values.push(from)
  }

  if (to) {
    conditions.push(`date <= $${index++}`)
    values.push(to)
  }

  const offset = (page - 1) * limit

  // get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM financial_records WHERE ${conditions.join(" AND ")}`,
    values
  )
  const total = parseInt(countResult.rows[0].count)

  // get paginated records
  values.push(limit)
  values.push(offset)

  const result = await query(
    `SELECT * FROM financial_records 
     WHERE ${conditions.join(" AND ")}
     ORDER BY date DESC
     LIMIT $${index++} OFFSET $${index++}`,
    values
  )

  res.json(new ApiResponse("records fetched successfully", {
    records: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }))
})

export const updateRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const body = req.body as UpdateRecordInput

  const existing = await query(
    "SELECT * FROM financial_records WHERE id = $1 AND is_deleted = FALSE",
    [id]
  )
  if (existing.rows.length === 0) {
    throw new ApiError(404, "record not found")
  }

  const fields: string[] = []
  const values: unknown[] = []
  let index = 1

  if (body.amount !== undefined) {
    fields.push(`amount = $${index++}`)
    values.push(body.amount)
  }

  if (body.type !== undefined) {
    fields.push(`type = $${index++}`)
    values.push(body.type)
  }

  if (body.category !== undefined) {
    fields.push(`category = $${index++}`)
    values.push(body.category)
  }

  if (body.date !== undefined) {
    fields.push(`date = $${index++}`)
    values.push(body.date)
  }

  if (body.notes !== undefined) {
    fields.push(`notes = $${index++}`)
    values.push(body.notes)
  }

  fields.push(`updated_at = NOW()`)
  values.push(id)

  const result = await query(
    `UPDATE financial_records SET ${fields.join(", ")}
     WHERE id = $${index}
     RETURNING *`,
    values
  )

  res.json(new ApiResponse("record updated successfully", result.rows[0]))
})

export const deleteRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const existing = await query(
    "SELECT id FROM financial_records WHERE id = $1 AND is_deleted = FALSE",
    [id]
  )
  if (existing.rows.length === 0) {
    throw new ApiError(404, "record not found")
  }

  await query(
    "UPDATE financial_records SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1",
    [id]
  )

  res.json(new ApiResponse("record deleted successfully", null))
})