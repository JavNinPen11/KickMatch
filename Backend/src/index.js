const express = require("express")
const cors = require("cors")

require("dotenv").config()

const authRoutes = require("./routes/authRoutes")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)

app.get("/",(req, res) => {
    res.send("Backend de KickMatch funcionando!!!")
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})
