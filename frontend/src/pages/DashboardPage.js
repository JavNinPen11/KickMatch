import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

export const DashboardPage = () => {

    const {logout} = useContext(AuthContext)

  return (
    <main>
        <Link to="/">Inicio</Link>
        <button onClick={logout}>Cerrar Sesión</button>
    </main>
  )
}
