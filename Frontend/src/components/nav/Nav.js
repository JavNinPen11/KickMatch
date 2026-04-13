import "./Nav.css"
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { useEffect } from "react"


export const Nav = () => {
    const { user, logout } = useContext(AuthContext)
    const [userName, setUserName] = useState()
    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            setUserName(JSON.parse(savedUser).username)
        }
    }, [])

    return (
        <nav className="navMenu">
            {
                user ? (
                    <div className="navSpace">
                        <span className="sesionName">Sesión de: {userName}</span>
                        <div className="contenedor">
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/dashboard">Dashboard</Link>
                            <a className="link" onClick={logout}>
                                Cerrar Sesión
                            </a>
                        </div>
                    </div>
                )
                    :
                    (
                        <div className="contenedor">
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/login">Iniciar Sesión</Link>
                            <Link className="link" to="/register">Registrarse</Link>
                        </div>
                    )
            }
        </nav>
    )
}
