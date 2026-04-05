import { Router } from "express"
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity,
} from "../controllers/dashboard.controller"
import verifyJWT from "../middlewares/auth.middleware"
import requireRole from "../middlewares/role.middleware"

const router = Router()

router.use(verifyJWT)

// viewer can only see summary
router.get("/summary", requireRole("admin", "analyst", "viewer"), getSummary)

// analyst and admin can see the rest
router.get("/by-category", requireRole("admin", "analyst"), getCategoryBreakdown)
router.get("/trends", requireRole("admin", "analyst"), getMonthlyTrends)
router.get("/recent", requireRole("admin", "analyst"), getRecentActivity)

export default router