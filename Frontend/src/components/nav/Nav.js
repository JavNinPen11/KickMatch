import "./Nav.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export const Nav = ({ variant = "default" }) => {
    const { user, logout } = useContext(AuthContext);
    const isAuthenticatedView = Boolean(user);
    const userName = user?.nombre ?? user?.username ?? "Usuario";

    // Navbar publica / privada
    return (
        <nav className={`navMenu ${variant === "landing" ? "navMenuLanding" : ""}`}>
            <div className="contenedor contenedorNav">
                <Link className="brandLink" to="/">KickMatch</Link>

                <div className="navLinks">
                    {isAuthenticatedView ? (
                        <>
                            <Link className="sesionName" to="/profile">Sesion de: {userName}</Link>
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/matches">Partidos</Link>
                            {/* <Link className="link" to="/my-matches">Mis partidos</Link> */}
                            <Link className="link" to="/dashboard">Dashboard</Link>
                            <button className="link navLogoutButton" type="button" onClick={logout}>
                                Cerrar sesion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/matches">Partidos</Link>
                            <Link className="link" to="/login">Iniciar sesion</Link>
                            <Link className="link linkHighlight" to="/register">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
