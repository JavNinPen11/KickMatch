import React, {useState} from "react";
import style from "./styleForms/registerForm.module.scss"

export const RegisterForm = ({onRegister}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")

    const handleSubmitSendForm = (e) => {
        e.preventDefault()
        onRegister({email, username, password})
    }
    return (
                <form className={style.registerForm} onSubmit={handleSubmitSendForm}>
            <p>Registro</p>

            <div className={style.formGroup}>
                <input
                    className="inputBase"
                    placeholder="Email"
                    type="email"
                    autoComplete="off"
                    id="txtEmail"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

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

            <button className={`btnOne ${style.btnRegister}`} type="submit">
                Registrarse
            </button>
        </form>
    )
}