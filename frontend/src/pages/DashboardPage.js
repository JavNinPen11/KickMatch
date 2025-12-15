import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Nav } from '../components/nav/Nav'

export const DashboardPage = () => {

    const {logout} = useContext(AuthContext)

  return (
    <main>
      <Nav/>
        <Link to="/">Inicio</Link>
        <button onClick={logout}>Cerrar Sesión</button>
    </main>
  )
}
