import express from "express"
import {createMatch, myMatches, deleteMatch} from "../controllers/matchController.js"

const router = express.Router()

router.post("/createMatch", createMatch)
router.get("/myMatches", myMatches)
router.delete("/deleteMatch", deleteMatch)

export default router