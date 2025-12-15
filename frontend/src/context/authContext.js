import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext()

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)

    useEffect(() =>{
        const token = localStorage.getItem("token")
        if(token){
            setUser({token})
        }
    }, [])
    const login = (userData, token) =>{
        localStorage.setItem("token", token)
        setUser(userData)
    }
    const logout = () =>{
        localStorage.removeItem("token")
        setUser(null)
        alert("Sesion cerrada con exito")
    }
    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}