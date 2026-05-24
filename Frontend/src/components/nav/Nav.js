import style from "./nav.module.scss"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext"

export const Nav = ({ variant = "default" }) => {
    const { user, logout } = useContext(AuthContext)
    
    const isLogged = Boolean(user)
    const userName = user?.username || user?.nombre || "Usuario"
    return (
        <nav className={`${style.navMenu} ${variant === "landing" ? style.navLanding : ""}`}>
            <div className={style.navContent}>
                <Link className={style.logo} to="/">
                    <img
                        className={style.img}
                        src="/system/KickMatchLogo.png"
                        alt="KickMatch"
                    />
                    <span className={style.logoText}>KickMatch</span>
                </Link>

                <div className={style.navLinks}>
                    {isLogged ? (
                        <>
                            <Link className={style.userChip} to="/profile">
                                <span className={style.userAvatar}>
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                                <span className={style.userName}>
                                    {userName.toUpperCase()} · MI PERFIL
                                </span>
                            </Link>

                            <Link className={style.navLink} to="/">
                                Home
                            </Link>

                            <Link className={style.navLink} to="/matches">
                                Partidos
                            </Link>

                            <Link className={style.navLink} to="/reservas">
                                Reservas
                            </Link>

                            <Link className={style.navLink} to="/dashboard">
                                Dashboard
                            </Link>

                            <button
                                className={`${style.navLink} ${style.logoutBtn}`}
                                type="button"
                                onClick={logout}
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className={style.navLink} to="/">
                                Home
                            </Link>

                            <Link className={style.navLink} to="/matches">
                                Partidos
                            </Link>

                            <Link className={style.navLogin} to="/login">
                                Iniciar sesión
                            </Link>

                            <Link className={style.navRegister} to="/register">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}