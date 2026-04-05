import { Request, Response } from "express"
import { query } from "../db"
import asyncHandler from "../utils/AsyncHandler"
import ApiResponse from "../utils/ApiResponse"

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net_balance
     FROM financial_records
     WHERE is_deleted = FALSE`
  )

  res.json(new ApiResponse("summary fetched successfully", result.rows[0]))
})

export const getCategoryBreakdown = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT 
      category,
      type,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS count
     FROM financial_records
     WHERE is_deleted = FALSE
     GROUP BY category, type
     ORDER BY total DESC`
  )

  res.json(new ApiResponse("category breakdown fetched successfully", result.rows))
})

export const getMonthlyTrends = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT
      TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net
     FROM financial_records
     WHERE is_deleted = FALSE
     GROUP BY DATE_TRUNC('month', date)
     ORDER BY DATE_TRUNC('month', date) DESC`
  )

  res.json(new ApiResponse("monthly trends fetched successfully", result.rows))
})

export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(
    `SELECT 
      id, amount, type, category, date, notes, created_at
     FROM financial_records
     WHERE is_deleted = FALSE
     ORDER BY created_at DESC
     LIMIT 10`
  )

  res.json(new ApiResponse("recent activity fetched successfully", result.rows))
})