import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { API_URL } from "../../api/authService";
import { Navigate } from "react-router-dom";
import Loading from "../forms/Loading";

function AdminRoute({children}){
    const {logout} = useContext(AuthContext)
    const [status, setStatus] = useState("checking")

    useEffect(() => {
        const verifyRole = async () => {
            try{
                const res = await fetch(`${API_URL}/admin/role`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},

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
    }, [logout])
    if(status === "checking") return <Loading/>
    if(status === "unauthorized") return <Navigate to="/" replace/>
    return children
}
export default AdminRoute