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
            <input placeholder='Usuario' type='text' autoComplete='off' id='txtUsername' required onChange={e => setUsername(e.target.value)}></input>
        </div>
        <div className='form-group'>
            <input placeholder='Contraseña' type='password'autoComplete='off' id='txtPassword'required onChange={e => setPassword(e.target.value)}></input>
        </div>
        <button className='submit'>Login</button>
    </form>
  )
}
