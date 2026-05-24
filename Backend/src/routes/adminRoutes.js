import express from "express"
import { adminUpdateUser, getAllMatches } from "../controllers/adminController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/adminMiddleware.js"
import { cancelMatch, deleteMatch } from "../controllers/matchController.js"
import { getAllUsers } from "../controllers/userController.js"

const router = express.Router()

router.get("/getMatches", verifyToken, isAdmin, getAllMatches)
router.get("/role", verifyToken, (req, res) => {
    res.json({ role: req.user.role })
})
router.delete("/matches/:id", verifyToken, isAdmin, deleteMatch)
router.put("/matches/:id/cancel", verifyToken, isAdmin, cancelMatch)
router.get("/getUsers", verifyToken, isAdmin, getAllUsers)
router.put("/users/:id", verifyToken, isAdmin, adminUpdateUser)

export default router