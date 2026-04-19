import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function PrivateRoute ({children}){
    const {user} = useContext(AuthContext)
    if(!user) {alert("Debe iniciar sesión antes de acceder a páginas protegidas") }
    return user ? children : <Navigate to="/"/>
}

export default PrivateRoute