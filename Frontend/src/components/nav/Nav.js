import style from "./nav.module.scss"
import { useContext, useEffect, useState } from "react"
import { API_URL } from "../../api/authService"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext"


export const Nav = ({ variant = "default" }) => {
    const { user, logout } = useContext(AuthContext)

    const isLogged = Boolean(user)
    const userName = user?.username || user?.nombre || "Usuario"
    const [isAdmin, setIsAdmin] = useState(false)
    const [adminOpen, setAdminOpen] = useState(false)

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                const res = await fetch(`${API_URL}/admin/role`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                setIsAdmin(data.role === "admin")
            } catch {
                setIsAdmin(false)
            }
        }

        if (isLogged) checkAdmin()
        else setIsAdmin(false)
    }, [isLogged])


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
                            {isAdmin && (
                                <div className={style.adminMenu}>
                                    <button
                                        className={style.adminBtn}
                                        type="button"
                                        onClick={() => setAdminOpen((prev) => !prev)}
                                    >
                                        Admin ▾
                                    </button>

                                    {adminOpen && (
                                        <div className={style.adminDropdown}>
                                            <Link to="/admin" onClick={() => setAdminOpen(false)}>Panel admin</Link>
                                            <Link to="/admin/fields" onClick={() => setAdminOpen(false)}>Campos</Link>
                                        </div>
                                    )}
                                </div>
                            )}  
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