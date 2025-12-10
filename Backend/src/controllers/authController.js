const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const users = []

const register = async (req, res) => {
    const{username, password} = req.body

    const existingUser = users.find(u => u.username === username)
    if(existingUser){
        return res.status(400).json({message:"Usuario ya existente"})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword
    }
    users.push(newUser)
    res.status(201).json({message:"Usuario creado", user:{id:newUser.id, username: newUser.username}})

}
const login = async (req, res) => {
    const{username, password} = req.body
    const user = users.find(u => u.username === username)
    if(!user){
        return res.status(404).json({message:"Usuario inexistente"}) 
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        return res.status(400).json({message:"Contraseña incorrecta"})
    }
    const token = jwt.sign({id:user.id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )
    res.json({message:"Login esitoso!!!", token})
}

module.exports = { register, login, users};