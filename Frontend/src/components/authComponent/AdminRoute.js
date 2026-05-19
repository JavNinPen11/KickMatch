import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { API_URL } from "../../api/authService";
import { Navigate } from "react-router-dom";

function AdminRoute({children}){
    const {user, logout} = useContext(AuthContext)
    const [status, setStatus] = useState("checking")

    useEffect(() => {
        const verifyRole = async () => {
            try{
                const res = await fetch(`${API_URL}/admin/role`, {
                    headers: {Authorization: `Bearer ${user.token}`},

                })
                if(res.status === 401){
                    logout()
                    setStatus("unauthorized")
                    return
                }
                const data = await res.json()
                data.role === "admin" 
                ? setStatus("authorized") 
                : setStatus("unauthorized")

            }
            catch{
                setStatus("unauthorized")
            }
        }
        verifyRole()
    }, [user.token, logout])
    if(status === "checking") return <p>Verificando permisos...</p>
    if(status === "unauthorized") return <Navigate to="/" replace/>
    return children
}
export default AdminRoute