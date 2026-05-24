import express from "express"
import { adminDeleteUser, adminUpdateUser, cancelAdminReserva, createAdminMatch, createAdminUser, deleteAdminReserva, getAdminReservas, getAllMatches } from "../controllers/adminController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isAdmin } from "../middleware/adminMiddleware.js"
import { cancelMatch, deleteMatch, updateMatch } from "../controllers/matchController.js"
import { getAllUsers } from "../controllers/userController.js"

const router = express.Router()

router.get("/getMatches", verifyToken, isAdmin, getAllMatches)
router.get("/getUsers", verifyToken, isAdmin, getAllUsers)
router.get("/reservas", verifyToken, isAdmin, getAdminReservas)
router.get("/role", verifyToken, (req, res) => {res.json({ role: req.user.role })})

router.post("/users", verifyToken, isAdmin, createAdminUser)
router.post("/matches", verifyToken, isAdmin, createAdminMatch)

router.delete("/matches/:id", verifyToken, isAdmin, deleteMatch)
router.delete("/users/:id", verifyToken, isAdmin, adminDeleteUser)
router.delete("/reservas/:id", verifyToken, isAdmin, deleteAdminReserva)

router.put("/matches/:id/cancel", verifyToken, isAdmin, cancelMatch)
router.put("/users/:id", verifyToken, isAdmin, adminUpdateUser)
router.put("/matches/:id", verifyToken, isAdmin, updateMatch)

router.patch("/reservas/:id/cancelar", verifyToken, isAdmin, cancelAdminReserva)

export default router