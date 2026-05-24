import { Link } from "react-router-dom"
import style from "./styleForms/footer.module.scss"

export function Footer() {
    return (
        <footer className={style.footer}>
            <div className={style.content}>
                <div className={style.brand}>
                    <div className={style.logo}>
                        <img src="/system/KickMatchLogo.png" alt="KickMatch" className={style.logoImg} />
                        <span className={style.logoText}>KickMatch</span>
                    </div>
                    <p className={style.tagline}>
                        Organiza tus partidos de fútbol, reserva pistas y conecta con otros jugadores.
                    </p>
                    <div className={style.socials}>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className={style.social}>IG</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className={style.social}>TW</a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className={style.social}>GH</a>
                    </div>
                </div>

                <div className={style.links}>
                    <div className={style.col}>
                        <h4>Plataforma</h4>
                        <Link to="/matches">Partidos</Link>
                        <Link to="/reservas">Reservas</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>

                    <div className={style.col}>
                        <h4>Cuenta</h4>
                        <Link to="/login">Iniciar sesión</Link>
                        <Link to="/register">Registrarse</Link>
                        <Link to="/profile">Mi perfil</Link>
                    </div>

                    <div className={style.col}>
                        <h4>Legal</h4>
                        <Link to="/about">Sobre nosotros</Link>
                        <Link to="/contact">Contacto</Link>
                        <Link to="/terms">Términos y condiciones</Link>
                    </div>
                </div>
            </div>

            <div className={style.bottom}>
                <p>© {new Date().getFullYear()} KickMatch. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}