import { useContext, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Nav } from "../components/nav/nav"
import { AuthContext } from "../context/authContext"
import { getMeRequest } from "../api/userService"
import { getUserMatchesSummary } from "../utils/userMatches"
import style from "./css/dashboardPage.module.scss"

export const DashboardPage = () => {
    const { user } = useContext(AuthContext)
    const [profile, setProfile] = useState(null)
    const [matches] = useState([])

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getMeRequest(user.token)
                setProfile(res.data)
            } catch (error) {
                setProfile(null)
            }
        }

        if (user?.token) {
            loadProfile()
        }
    }, [user])

    const summary = useMemo(
        () => getUserMatchesSummary(matches, user, profile),
        [matches, user, profile]
    )

    const stats = [
        { label: "Próximos partidos", value: summary.upcomingMatches.length },
        { label: "Creados por mí", value: summary.createdMatches.length },
        { label: "Apuntado", value: summary.joinedMatches.length },
        { label: "Jugados", value: summary.playedMatches.length },
    ]

    const nextMatch = summary.upcomingMatches[0] || null

    return (
       <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.hero}>
                    <article className={`cardBase ${style.mainCard}`}>
                        <span className="labelYellow">Zona privada</span>

                        <div className={style.cardText}>
                            <h1>Hola, {summary.currentUser.username}</h1>
                            <p>
                                Aquí tienes un resumen claro de tu actividad en KickMatch
                                y accesos rápidos para ir a la zona de partidos cuando lo
                                necesites.
                            </p>
                        </div>

                        <div className="groupBtns">
                            <Link className="btnOne" to="/matches">
                                Ver partidos
                            </Link>
                        </div>
                    </article>

                    <aside className={`cardBase ${style.userCard}`}>
                        <span className="labelYellow">Resumen del usuario</span>

                        <div className={style.userRow}>
                            <div className={style.userBox}>
                                <span>Usuario</span>
                                <strong>{summary.currentUser.username}</strong>
                            </div>

                            <div className={style.userBox}>
                                <span>Rol</span>
                                <strong>Jugador</strong>
                            </div>
                        </div>
                    </aside>
                </section>

                <section className={style.section}>
                    <div className={style.sectionTop}>
                        <span className="labelYellow">Resumen</span>
                        <h2>Tu actividad en un vistazo</h2>
                    </div>

                    <div className={style.stats}>
                        {stats.map((item) => (
                            <article className={`cardBase ${style.statCard}`} key={item.label}>
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={style.agenda}>
                    <div className={style.sectionTop}>
                        <span className="labelYellow">Próximos partidos</span>
                        <h2>Resumen rápido de tu agenda</h2>
                    </div>

                    {nextMatch ? (
                        <article className={`cardBase ${style.agendaCard}`}>
                            <div className={style.agendaTop}>
                                <h3>Tu próximo partido</h3>
                            </div>

                            <div className={style.agendaInfo}>
                                <p>
                                    Ya tienes un encuentro pendiente en tu agenda. Entra en
                                    partidos para ver el detalle completo.
                                </p>
                            </div>

                            <div className={style.agendaData}>
                                <p>
                                    <strong>Ubicación</strong>
                                    <span>{nextMatch.ubicacion}</span>
                                </p>
                                <p>
                                    <strong>Hora</strong>
                                    <span>{nextMatch.hora}</span>
                                </p>
                            </div>

                            <div className="groupBtns">
                                <Link className="btnOne" to="/matches">
                                    Ver partidos
                                </Link>
                            </div>
                        </article>
                    ) : (
                        <article className={`cardBase ${style.emptyCard}`}>
                            <div className={style.agendaTop}>
                                <h3>Aún no tienes próximos partidos</h3>
                            </div>

                            <div className={style.agendaInfo}>
                                <p>
                                    Entra en partidos para crear uno nuevo o apuntarte a un
                                    encuentro abierto.
                                </p>
                            </div>

                            <div className="groupBtns">
                                <Link className="btnOne" to="/matches">
                                    Explorar partidos
                                </Link>
                            </div>
                        </article>
                    )}
                </section>
            </div>
        </main>
    )
}