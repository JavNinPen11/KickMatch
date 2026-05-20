import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext()

export function AuthProvider ({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const isTokenExpired = (token) => {
        try{
            const payload = JSON.parse(atob(token.split(".")[1]))
            return Date.now() >= payload.exp * 1000
        }
        catch{
            return true
        }
    }


    useEffect(() =>{
        const token = localStorage.getItem("token")

        if(token){
            if(isTokenExpired(token)){
                localStorage.removeItem("token")
            }
            else{
                const payload = JSON.parse(atob(token.split(".")[1]))
                setUser(payload)
            }
        }
        setLoading(false)
        
    }, [])
    const login = (token) =>{
        localStorage.setItem("token", token)
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser(payload)
    }
    const logout = useCallback(() =>{
        localStorage.removeItem("token")
        setUser(null)
        alert("Sesion cerrada con exito")
    }, [])
    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}