import jwt from "jsonwebtoken"

export function authMiddleware (res, req, next){
    const authHeader = req.headers.autorization

    if(!authHeader){
        res.status(401).json({message:"Token requerido"})
    }
    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (error){
        return res.status(401).json({message:"Token invalido"})
    }
}