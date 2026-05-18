import { Link, useNavigate } from "react-router-dom"
import {RegisterForm} from "../components/forms/RegisterForm.js"
import { useContext, useState } from "react"
import { registerRequest } from "../api/authService.js"
import { AuthContext } from "../context/authContext.js"
import style from "./stylePages/registerPage.module.scss"
function Register (){
    const [message, setMessage] = useState("")
    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleRegister = async ({email, username, password}) => {
        try{            
            const response = await registerRequest(email,username,password)

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
          <main className={`mainPage ${style.registerPage}`}>
            <section className={style.registerBox}>
                <span className="labelYellow">Registro</span>

                <h1>Crear cuenta</h1>

                <p className="textBase">
                    Regístrate para crear partidos, apuntarte a encuentros y acceder a tu dashboard.
                </p>

                <div className={`cardBase ${style.registerCard}`}>
                    <RegisterForm onRegister={handleRegister} />

                    {message ? (
                        <p className="message">{message}</p>
                    ) : null}
                </div>

                <div className={style.links}>
                    <p className="textBase">¿Ya tienes cuenta?</p>

                    <Link className="btnTwo" to="/login">
                        Iniciar sesión
                    </Link>

                    <Link className={style.homeLink} to="/">
                        Ir al inicio
                    </Link>
                </div>
            </section>
        </main>
)
}
export default Register