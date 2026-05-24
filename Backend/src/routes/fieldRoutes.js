import { Router } from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/adminMiddleware.js"
import { getFields, getEscaparate, getFieldById, createField, updateField, toggleEscaparate, deleteField } from "../controllers/fieldController.js"

const router = Router()

router.get("/", verifyToken, getFields)
router.get("/escaparate", getEscaparate)
router.get("/:id", verifyToken, getFieldById)
router.post("/", verifyToken, isAdmin, createField)
router.put("/:id", verifyToken, isAdmin, updateField)
router.patch("/:id/toggle", verifyToken, isAdmin, toggleEscaparate)
router.delete("/:id", verifyToken, isAdmin, deleteField)

export default router