import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext()

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() =>{
        const savedUser = localStorage.getItem("user")

        if(savedUser){
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
        
    }, [])
    const login = (userData, token) =>{
        const userToSave = {...userData, token}
        localStorage.setItem("user", JSON.stringify(userToSave))
        setUser(userToSave)
    }
    const logout = () =>{
        localStorage.removeItem("user")
        setUser(null)
        alert("Sesion cerrada con exito")
    }
    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}