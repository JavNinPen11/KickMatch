import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMe, updateMe, deleteMe } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.delete("/me", verifyToken, deleteMe);

export default router;
