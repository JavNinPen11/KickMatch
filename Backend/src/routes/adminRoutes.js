import express from "express"
import { adminDeleteUser, adminUpdateUser, createAdminMatch, createAdminUser, getAllMatches } from "../controllers/adminController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/adminMiddleware.js"
import { cancelMatch, deleteMatch, updateMatch } from "../controllers/matchController.js"
import { getAllUsers } from "../controllers/userController.js"

const router = express.Router()

router.get("/getMatches", verifyToken, isAdmin, getAllMatches)
router.get("/getUsers", verifyToken, isAdmin, getAllUsers)
router.get("/role", verifyToken, (req, res) => {
    res.json({ role: req.user.role })
})
router.post("/users", verifyToken, isAdmin, createAdminUser)
router.post("/matches", verifyToken, isAdmin, createAdminMatch)
router.delete("/matches/:id", verifyToken, isAdmin, deleteMatch)
router.delete("/users/:id", verifyToken, isAdmin, adminDeleteUser)
router.put("/matches/:id/cancel", verifyToken, isAdmin, cancelMatch)
router.put("/users/:id", verifyToken, isAdmin, adminUpdateUser)
router.put("/matches/:id", verifyToken, isAdmin, updateMatch)

export default router