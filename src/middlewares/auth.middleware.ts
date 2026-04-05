import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError"
import { AuthenticatedUser } from "../models/user.model"

interface AuthRequest extends Request {
  user?: AuthenticatedUser
}

const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "unauthorized, token missing"))
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthenticatedUser
    req.user = decoded
    next()
  } catch (error) {
    return next(new ApiError(401, "unauthorized, invalid or expired token"))
  }
}

export default verifyJWT