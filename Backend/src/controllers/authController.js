"use strict";
import bcrypt from "bcrypt";
import users from "../models/userModel.js";
import { getToken } from "./getToken.js";
import {prisma} from "../../lib/db.js"


const register = async (req, res) => {

    const { email, password, username } = req.body

    try {
        if (!email || !password || !username) {
           return res.status(400).json({ message: "Todos los campos son obligatorios" })
        }

        const existingEmail = await prisma.user.findUnique({
            where: {email}
        })

        if(existingEmail){
            return res.status(400).json({message:"El usuario ingresado ya existe"})
        }

        const existingUsername = await prisma.user.findUnique({
            where: {username}
        })

        if(existingUsername){
            return res.status(400).json({message:"El username ingresado ya está en uso"})
        }
        
        const hashedPassword = bcrypt.hashSync(password, 10)

        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                username
            }
        })

        const token = getToken(user.id, user.email, user.username)

        return res.status(201).json({
            message:"Usuario creado correctamente",
            user:{
                id:user.id,
                email: user.email,
                username: user.username
            },
            token,
            ok: true
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({message:"Error interno en el servidor"})
    }
}
const login = async (req, res) => {
    const { username, password } = req.body
    const user = users.find(u => u.username === username)
    if (!user) {
        return res.status(404).json({ ok: false, message: "Usuario inexistente" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return res.status(400).json({ ok: false, message: "Contraseña incorrecta" })
    }

    const token = getToken(user.id, user.user)

    res.json({ ok: true, message: "Login esitoso!!!", token })
}

export {
    register,
    login
}  