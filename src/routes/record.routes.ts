import { Router } from "express"
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller"
import verifyJWT from "../middlewares/auth.middleware"
import requireRole from "../middlewares/role.middleware"
import validate, { validateQuery } from "../middlewares/validate.middleware"
import {
  createRecordSchema,
  updateRecordSchema,
  recordFilterSchema,
} from "../validators/record.validator"

const router = Router()

router.use(verifyJWT)

router.post("/", requireRole("admin"), validate(createRecordSchema), createRecord)
router.get("/", requireRole("admin", "analyst"), validateQuery(recordFilterSchema), getRecords)
router.patch("/:id", requireRole("admin"), validate(updateRecordSchema), updateRecord)
router.delete("/:id", requireRole("admin"), deleteRecord)

export default router