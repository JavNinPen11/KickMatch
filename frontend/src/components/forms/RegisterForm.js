import React, {useState} from "react";
import "./RegisterForm.css"

export const RegisterForm = ({onRegister}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        onRegister({username,password})
    }
    return (
        <form className="Register" onSubmit={handleSubmit}>
            <p>Registro</p>
            <div className="form-group">
                <input placeholder="Usuario" type="text" autoComplete="off" id="txtUsername" required onChange={e => setUsername(e.target.value)}></input>
            </div>
            <div className="form-group">
                <input placeholder="Contraseña" type="password" autoComplete="off" id="txtPassword" required onChange={e => setPassword(e.target.value)}></input>
            </div>
            <button className="submit">Register</button>
        </form>
    )
}