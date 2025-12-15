
import bcrypt from "bcrypt";
import users from "../models/userModel.js";
import { getToken } from "./getToken.js";

const register = async (req, res) => {

    const{username, password} = req.body

    const existingUser = users.find(u => u.username === username)
    if(existingUser){
        return res.status(400).json({message:"Usuario ya existente"})
    }

    const hashedPassword =  bcrypt.hashSync(password,10)

    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword
    }
    users.push(newUser)
    const token = getToken(newUser.id, newUser.username)

    res.status(201).json({message:"Usuario creado", /*user:{id:newUser.id, username: newUser.username}*/ok:true, token})

}
const login = async (req, res) => {
    const{username, password} = req.body
    const user = users.find(u => u.username === username)
    if(!user){
        return res.status(404).json({ok:false, message:"Usuario inexistente"}) 
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword){
        return res.status(400).json({ok:false ,message:"Contraseña incorrecta"})
    }

    // const token = jwt.sign({id:user.id, username: user.username},
    //     process.env.JWT_SECRET,
    //     {expiresIn: "1h"}
    // )
    
    const token = getToken(user.id, user.user)
    
    res.json({ok:true, message:"Login esitoso!!!", token})
}

export{
    register,
    login
}  