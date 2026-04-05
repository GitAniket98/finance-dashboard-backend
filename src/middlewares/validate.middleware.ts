import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod"
import ApiError from "../utils/ApiError"

const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message)
      return next(new ApiError(400, "validation failed", errors))
    }

    req.body = result.data
    next()
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message)
      return next(new ApiError(400, "invalid query parameters", errors))
    }

   ;(req as any).parsedQuery = result.data
    next()
  }
}

export default validate