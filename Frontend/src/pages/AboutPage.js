import { Nav } from "../components/nav/Nav"
import style from "./stylePages/aboutPage.module.scss"

export default function AboutPage() {
    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Sobre nosotros</span>
                    <h1>¿Qué es KickMatch?</h1>
                    <p className="textBase">
                        KickMatch es una red social diseñada para personas que comparten la pasión por el fútbol amateur.
                        Nuestra plataforma conecta jugadores que quieren organizarse, encontrar compañeros y reservar
                        pistas, sin necesidad de tener un equipo propio.
                    </p>
                </section>

                <section className={style.mission}>
                    <div className={`cardBase ${style.missionCard}`}>
                        <span className="labelYellow">Nuestra misión</span>
                        <h2>Fútbol para todos</h2>
                        <p className="textBase">
                            Creemos que el fútbol no debería depender de tener un equipo fijo. KickMatch nace para
                            eliminar esa barrera: cualquier persona puede crear un partido, apuntarse a uno existente
                            o reservar una pista, de forma rápida y sencilla.
                        </p>
                    </div>
                </section>

                <section className={style.features}>
                    <div className={style.sectionTop}>
                        <h2>¿Qué puedes hacer en KickMatch?</h2>
                    </div>

                    <div className={style.grid}>
                        <article className={`cardBase ${style.featureCard}`}>
                            <span className={style.icon}>⚽</span>
                            <h3>Crear partidos</h3>
                            <p className="textBase">Organiza un partido, define la fecha, hora y ubicación y espera a que otros jugadores se apunten.</p>
                        </article>

                        <article className={`cardBase ${style.featureCard}`}>
                            <span className={style.icon}>🤝</span>
                            <h3>Unirte a partidos</h3>
                            <p className="textBase">Encuentra partidos abiertos cerca de ti y apúntate con un solo clic.</p>
                        </article>

                        <article className={`cardBase ${style.featureCard}`}>
                            <span className={style.icon}>🏟️</span>
                            <h3>Reservar pistas</h3>
                            <p className="textBase">Consulta los campos disponibles, elige tu horario y confirma tu reserva fácilmente.</p>
                        </article>
                    </div>
                </section>

                <section className={style.team}>
                    <div className={style.sectionTop}>
                        <h2>El equipo</h2>
                        <p className="textBase">KickMatch es un proyecto desarrollado por dos estudiantes de Desarrollo de Aplicaciones Web.</p>
                    </div>

                    <div className={style.teamGrid}>
                        <article className={`cardBase ${style.teamCard}`}>
                            <div className={style.avatar}>JS</div>
                            <h3>Javier Santiago Niño Peñaloza</h3>
                            <span className="labelYellow">Desarrollador</span>
                            <p className="textBase">Desarrollo del backend, base de datos, panel de administración y arquitectura general del proyecto.</p>
                        </article>

                        <article className={`cardBase ${style.teamCard}`}>
                            <div className={style.avatar}>PE</div>
                            <h3>Paula Escribano Reina</h3>
                            <span className="labelYellow">Desarrolladora</span>
                            <p className="textBase">Desarrollo del frontend, diseño de interfaces y experiencia de usuario.</p>
                        </article>
                    </div>
                </section>
            </div>
        </main>
    )
}