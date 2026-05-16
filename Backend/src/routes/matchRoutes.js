import express from "express"
import {createMatch, myMatches} from "../controllers/matchController.js"

const router = express.Router()

router.post("/createMatch", createMatch)
router.get("/myMatches", myMatches)

export default router