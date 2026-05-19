import { LoginForm } from "../components/forms/loginForm"
import { loginRequest } from "../api/authService"
import style from"./stylePages/loginPage.module.scss"
import { useState, useContext } from "react"
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "../context/authContext"

function Login (){
    const {login} = useContext(AuthContext)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    const handleLogin = async ({username, password}) =>{
        try{
            const response = await loginRequest(username, password)
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
    return (
       <main className={`mainPage ${style.loginPage}`}>
            <section className={style.loginBox}>
                <span className="labelYellow">Login</span>

                <h1>Bienvenido</h1>

                <p className="textBase">
                    Inicia sesión para acceder a tu perfil, dashboard y partidos.
                </p>

                <div className={`cardBase ${style.loginCard}`}>
                    <LoginForm onLogin={handleLogin} />

                    {message ? (
                        <p className="message">{message}</p>
                    ) : null}
                </div>

                <div className={style.links}>
                    <p className="textBase">¿No tienes cuenta?</p>

                    <Link className="btnTwo" to="/register">
                        Registrarse
                    </Link>

                    <Link className={style.homeLink} to="/">
                        Ir al inicio
                    </Link>
                </div>
            </section>
        </main>
    )
}
export default Login