import { Router } from "express"
import { getAllUsers, getUserById, updateUser } from "../controllers/user.controller"
import verifyJWT from "../middlewares/auth.middleware"
import requireRole from "../middlewares/role.middleware"
import validate from "../middlewares/validate.middleware"
import { updateUserSchema } from "../validators/user.validator"

const router = Router()

// all user routes require authentication and admin role
router.use(verifyJWT, requireRole("admin"))

router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.patch("/:id", validate(updateUserSchema), updateUser)

export default router