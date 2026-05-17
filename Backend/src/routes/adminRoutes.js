import express from "express"
import { getAllMatches } from "../controllers/adminController.js"

const router = express.Router()

router.get("/getMatches", getAllMatches)

export default router