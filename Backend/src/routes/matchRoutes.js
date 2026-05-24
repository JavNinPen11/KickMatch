import express from "express"
import {createMatch, myMatches, deleteMatch, getMatches, updateMatch, cancelMatch, joinMatch, leaveMatch} from "../controllers/matchController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/createMatch", verifyToken, createMatch)
router.get("/myMatches", verifyToken, myMatches)
router.get("/getMatches", getMatches)
router.put("/:id", verifyToken, updateMatch)
router.put("/:id/cancel", verifyToken, cancelMatch)
router.delete("/:id", verifyToken, deleteMatch)
router.post("/:id/join", verifyToken, joinMatch)
router.delete("/:id/leave", verifyToken, leaveMatch)

export default router