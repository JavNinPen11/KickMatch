import { Router } from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/adminMiddleware.js"
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/fieldCategoryController.js"

const router = Router()

router.get("/", verifyToken, getCategories)
router.post("/", verifyToken, isAdmin, createCategory)
router.put("/:id", verifyToken, isAdmin, updateCategory)
router.delete("/:id", verifyToken, isAdmin, deleteCategory)

export default router