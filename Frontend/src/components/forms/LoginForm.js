import { useState } from "react"
import style from "./styleForms/loginForm.module.scss"

export const LoginForm = ({onLogin}) => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitSendForm = (e) =>{
    e.preventDefault()
    onLogin({username, password})
  }

  return (
        <form className={style.loginForm} onSubmit={handleSubmitSendForm}>
            <p>Inicia sesión</p>

            <div className={style.formGroup}>
                <input
                    className="inputBase"
                    placeholder="Usuario"
                    type="text"
                    autoComplete="off"
                    id="txtUsername"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className={style.formGroup}>
                <input
                    className="inputBase"
                    placeholder="Contraseña"
                    type="password"
                    autoComplete="off"
                    id="txtPassword"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button className={`btnOne ${style.btnLogin}`} type="submit">
                Login
            </button>
        </form>
    )
}