import express from "express"
import {createMatch, myMatches, deleteMatch} from "../controllers/matchController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/createMatch", createMatch)
router.get("/myMatches", verifyToken, myMatches)
router.delete("/deleteMatch", deleteMatch)

export default router