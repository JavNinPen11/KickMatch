import { Link, useNavigate } from "react-router-dom"
import {RegisterForm} from "../components/forms/RegisterForm.js"
import { useContext, useState } from "react"
import { registerRequest } from "../api/authService.js"
import { AuthContext } from "../context/authContext.js"
import "./RegisterPage.css"
function Register (){
    const [message, setMessage] = useState("")
    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleRegister = async ({username, password}) => {
        try{
            console.log(username, password);
            
            const response = await registerRequest(username,password)
            console.log(response);
            
            if(response.token){
                login({username}, response.token)
                navigate("/dashboard")
            }
            else{
                setMessage(response.message)
            }
        }
        catch(error){
            console.log(error);
            setMessage("Error del servidor")            
        }
    }
    return( 
    <main className="contenedor">
        <h1>Bienvenido al Registro</h1>
        <div className="registerForm">
            <RegisterForm onRegister={handleRegister}/>
            {message && <p className="message"></p>}
        </div>
        <Link to="/">Ir al Inicio</Link>
    </main>
)
}
export default Register