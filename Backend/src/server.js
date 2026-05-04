import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import matchRoutes from "./routes/matchRoutes.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/match", matchRoutes)

app.get("/",(req, res) => {
    res.send("Backend de KickMatch funcionando!!!")
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})

app.use("/users", userRoutes);
