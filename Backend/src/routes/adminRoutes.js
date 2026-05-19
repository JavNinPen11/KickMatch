import express from "express"
import { getAllMatches } from "../controllers/adminController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/getMatches", getAllMatches)
router.get("/role", verifyToken, (req, res) => {
    res.json({role: req.user.role})
})

export default router