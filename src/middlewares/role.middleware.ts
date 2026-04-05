import { Request, Response, NextFunction } from "express"
import { Role } from "../constants"
import ApiError from "../utils/ApiError"
import { AuthenticatedUser } from "../models/user.model"

interface AuthRequest extends Request {
  user?: AuthenticatedUser
}

const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "unauthorized, token missing"))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "forbidden, insufficient permissions"))
    }

    next()
  }
}

export default requireRole