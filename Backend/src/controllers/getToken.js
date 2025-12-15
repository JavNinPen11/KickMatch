import jwt from "jsonwebtoken";

export function getToken(id, username){
    const token = jwt.sign({id:id, username: username},
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )
    // const token = jwt.sign({id:user.id, username: user.username},
    //     process.env.JWT_SECRET,
    //     {expiresIn: "1h"}
    // )
    return token
}