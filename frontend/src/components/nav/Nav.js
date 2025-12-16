import "./Nav.css"
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

export const Nav = () => {
    const { user, logout } = useContext(AuthContext)

    return (
        <nav className="navMenu">
            {
                user ? (
                    <div className="contenedor">
                        <Link className="link" to="/">Home</Link>
                        <Link className="link" to="/dashboard">Dashboard</Link>
                        <a className="link" onClick = {logout}>
                            Cerrar Sesión
                        </a>
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
