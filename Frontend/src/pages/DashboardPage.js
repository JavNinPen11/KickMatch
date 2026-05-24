import { useContext, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Nav } from "../components/nav/Nav"
import { AuthContext } from "../context/authContext"
import { getMeRequest } from "../api/userService"
import { getUserMatchesSummary } from "../utils/userMatches"
import style from "./stylePages/dashboardPage.module.scss"
import { myMatchesRequest, cancelMatchRequest, leaveMatchRequest, updateMatchRequest } from "../api/matchService"
import { normalizeMatch } from "../api/matchUtils"
import { formatDate } from "../utils/formatUtils"

export const DashboardPage = () => {
    const { user } = useContext(AuthContext)
    const [profile, setProfile] = useState(null)
    const [matches, setMatches] = useState([])
    const [editMatch, setEditMatch] = useState(null)
    const [editMatchForm, setEditMatchForm] = useState({
        date: "", time: "", location: "", maxPlayers: ""
    })

    const handleCancelMatch = async (matchId) => {
        const confirmCancel = window.confirm("¿Seguro que quieres cancelar este partido?")

        if (!confirmCancel) {
            return
        }

        try {
            await cancelMatchRequest(matchId)

            const response = await myMatchesRequest()
            const data = Array.isArray(response?.matches) ? response.matches : []

            setMatches(data.map(normalizeMatch)

            )
        } catch (error) {
            setMatches([])
        }
    }

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

            }
            catch {
                setMatches([])
            }
        }
        if (localStorage.getItem("token")) {
            loadMatches()
        }
    }, [user])
    useEffect(() => {
        if (window.location.hash === "#proximos-partidos") {
            setTimeout(() => {
                const el = document.getElementById("proximos-partidos")
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
            }, 300)
        }
    }, [])

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

    const upcomingMatches = summary.upcomingMatches

    const handleLeaveMatch = async (matchId) => {
        try {
            await leaveMatchRequest(matchId)
            const response = await myMatchesRequest()
            const data = Array.isArray(response?.matches) ? response.matches : []
            setMatches(data.map(normalizeMatch))
        } catch (error) {
            console.error(error)
        }
    }
    const handleUpdateMatch = async () => {
        try {
            await updateMatchRequest(editMatch.id, editMatchForm)
            const response = await myMatchesRequest()
            const data = Array.isArray(response?.matches) ? response.matches : []
            setMatches(data.map(normalizeMatch))
            setEditMatch(null)
        } catch (error) {
            console.error(error)
        }
    }

    const openEditMatch = (match) => {
        setEditMatch(match)
        setEditMatchForm({
            date: match.fecha,
            time: match.hora,
            location: match.ubicacion,
            maxPlayers: match.maxJugadores
        })
    }


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

                <section className={style.agenda} id="proximos-partidos">
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
                                        {String(match.creador?.id) === String(summary.currentUser.id) &&
                                            match.estado !== "cancelado" ? (
                                            <button
                                                className={`btnTwo ${style.btnCancelMatch}`}
                                                type="button"
                                                onClick={() => handleCancelMatch(match.id)}
                                            >
                                                Cancelar partido
                                            </button>
                                        ) : null}
                                        {String(match.creador?.id) === String(summary.currentUser.id) && (
                                            <button
                                                className={`btnOne ${style.btnCancelMatch}`}
                                                type="button"
                                                onClick={() => openEditMatch(match)}
                                            >
                                                Editar partido
                                            </button>
                                        )}
                                        {match.participantes?.some(p => String(p.id) === String(summary.currentUser.id)) &&
                                            String(match.creador?.id) !== String(summary.currentUser.id) ? (
                                            <button
                                                className={`btnTwo ${style.btnCancelMatch}`}
                                                type="button"
                                                onClick={() => handleLeaveMatch(match.id)}
                                            >
                                                Desapuntarme
                                            </button>
                                        ) : null}
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
                    {editMatch && (
                        <div className={style.deletePopup}>
                            <div className={style.deletePopupCard}>
                                <button className={style.btnClose} type="button" onClick={() => setEditMatch(null)}>x</button>
                                <h2>Editar partido</h2>

                                <div className={style.formGroup}>
                                    <label>Fecha</label>
                                    <input className="inputBase" type="date" value={editMatchForm.date}
                                        onChange={(e) => setEditMatchForm((p) => ({ ...p, date: e.target.value }))} />
                                </div>

                                <div className={style.formGroup}>
                                    <label>Hora</label>
                                    <input className="inputBase" type="time" value={editMatchForm.time}
                                        onChange={(e) => setEditMatchForm((p) => ({ ...p, time: e.target.value }))} />
                                </div>

                                <div className={style.formGroup}>
                                    <label>Ubicación</label>
                                    <input className="inputBase" type="text" value={editMatchForm.location}
                                        onChange={(e) => setEditMatchForm((p) => ({ ...p, location: e.target.value }))} />
                                </div>

                                <div className={style.formGroup}>
                                    <label>Máximo de jugadores</label>
                                    <input className="inputBase" type="number" min="2" max="20" value={editMatchForm.maxPlayers}
                                        onChange={(e) => setEditMatchForm((p) => ({ ...p, maxPlayers: e.target.value }))} />
                                </div>

                                <div className="groupBtns">
                                    <button className="btnOne" type="button" onClick={handleUpdateMatch}>Guardar</button>
                                    <button className="btnTwo" type="button" onClick={() => setEditMatch(null)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}