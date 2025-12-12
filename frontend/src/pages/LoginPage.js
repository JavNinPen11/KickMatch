import { LoginForm } from "../components/forms/LoginForm"
import { loginRequest } from "../api/authService"
import "./LoginPage.css"
import { useState } from "react"

function Login (){
    const [message, setMessage] = useState("")
    const handleLogin = async ({username, password}) =>{
        try{
            const response = await loginRequest(username, password)
            setMessage(response.message)
        }
        catch(error){
            // alert(error)
            console.log(error);
            
        }
    }
    return (
        <main className="contenedor">
            <h1>Bienvenido al login</h1>
            <div className="loginForm">
                <LoginForm onLogin={handleLogin}/>
                <p className="message">{message}</p>
            </div>
        </main>
    )
}
export default Login