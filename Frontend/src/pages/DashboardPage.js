import { useContext, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Nav } from "../components/nav/Nav"
import { AuthContext } from "../context/authContext"
import { getMeRequest } from "../api/userService"
import { getUserMatchesSummary } from "../utils/userMatches"
import style from "./stylePages/dashboardPage.module.scss"
import { myMatchesRequest } from "../api/matchService"
import { normalizeMatch } from "../api/matchUtils"
import { formatDate, formatState } from "../utils/formatUtils"

export const DashboardPage = () => {
    const { user } = useContext(AuthContext)
    const [profile, setProfile] = useState(null)
    const [matches, setMatches] = useState([])

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getMeRequest()
                setProfile(res.data)
            } catch (error) {
                setProfile(null)
            }
        }

        if (localStorage.getItem("token")) {
            loadProfile()
        }
    }, [user])

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const response = await myMatchesRequest(user.id)

                const data = Array.isArray(response?.matches) ? response.matches : []
                setMatches(data.map(normalizeMatch))
                console.log(data);

            }
            catch {
                setMatches([])
            }
        }
        if (localStorage.getItem("token")) {
            loadMatches()
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

    const upcomingMatches = summary.upcomingMatches.slice(0, 3)

    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.hero}>
                    <article className={`cardBase ${style.mainCard}`}>

                        <div className={style.cardText}>
                            <h1>Hola, {summary.currentUser.username}</h1>
                            <p>
                                Consulta tu actividad en KickMatch
                                y accede rápidamente a tus partidos.
                            </p>
                        </div>

                        <div className={style.mainAction}>
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
                        <span className="labelYellow">Resumen de tu actividad</span>
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
                    </div>

                    {upcomingMatches.length > 0 ? (
                        <article className={`cardBase ${style.agendaCard}`}>
                            <div className={style.agendaTop}>
                                <h3>Tus próximos partidos</h3>
                            </div>

                            <div className={style.matchList}>
                                {upcomingMatches.map((match) => (
                                    <article className={style.matchItem} key={match.id}>
                                        <h4>{match.nombre || `Partido el ${formatDate(match.fecha)}`}</h4>

                                        <div className={style.matchInfo}>
                                            <p>
                                                <strong>Fecha</strong>
                                                <span>{formatDate(match.fecha)}</span>
                                            </p>

                                            <p>
                                                <strong>Hora</strong>
                                                <span>{match.hora}</span>
                                            </p>

                                            <p>
                                                <strong>Ubicación</strong>
                                                <span>{match.ubicacion}</span>
                                            </p>

                                            <p>
                                                <strong>Estado</strong>
                                                <span>{match.estado}</span>
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className={style.agendaAction}>
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