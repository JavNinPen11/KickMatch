import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

// si no tiene sesion iniciada manda al login 
function PrivateRoute({ children }) {
    const { user } = useContext(AuthContext)
    if (!user) 
    {
        return <Navigate to="/login" replace />
    }
    return children
}

export default PrivateRoute