import { LoginForm } from "../components/forms/LoginForm"
import { loginRequest } from "../api/authService"
import "./LoginPage.css"
import { useState, useContext } from "react"
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "../context/authContext"

function Login (){
    const {login} = useContext(AuthContext)
    const [message, setMessage] = useState("...")
    const navigate = useNavigate()
    const handleLogin = async ({username, password}) =>{
        try{
            const response = await loginRequest(username, password)
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
    return (
        <main className="contenedor">
            <h1>Bienvenido al login</h1>
            <div className="loginForm">
                <LoginForm onLogin={handleLogin}/>
                <p className="message">{message}</p>
            </div>
            <Link to="/">Ir al Inicio</Link>
        </main>
    )
}
export default Login