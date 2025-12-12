import React, { useState } from 'react'
import "./LoginForm.css"

export const LoginForm = ({onLogin}) => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) =>{
    e.preventDefault()
    onLogin({username, password})
  }

  return (
    <form className='Login' onSubmit={handleSubmit}>
        <p>Inicia Sesión</p>
        <div className='form-group'>
            <label>Usuario</label>
            <input type='text' id='txtUsername' onChange={e => setUsername(e.target.value)}></input>
        </div>
        <div className='form-group'>
            <label>Contraseña</label>
            <input type='text' id='txtPassword'onChange={e => setPassword(e.target.value)}></input>
        </div>
        <button className='submit'>Login</button>
    </form>
  )
}
