import { useContext, useEffect, useState } from "react"
import { Nav } from "../components/nav/Nav"
import { CreateMatchForm } from "../components/forms/CreateMatchForm"
import { MatchCard } from "../components/forms/matchCard"
import { AuthContext } from "../context/authContext"
import { getMatchUser } from "../utils/userMatches"
import { normalizeMatch } from "../api/matchUtils"
import { allMatches, createMatchRequest, joinMatchRequest, leaveMatchRequest } from "../api/matchService"
import style from "./stylePages/matchesPage.module.scss"

export default function MatchesPage() {
    const { user } = useContext(AuthContext)
    const currentUser = getMatchUser(user)

    const [matches, setMatches] = useState([])
    const [message, setMessage] = useState()
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const response = await allMatches()
                const data = Array.isArray(response?.matches) ? response.matches : []

                if (Array.isArray(data)) {
                    const normalizedMatches = data.map(normalizeMatch).filter((m) => m.estado !== "cancelado" && m.estado !== "finalizado" && m.estado !== "completado")
                    setMatches(normalizedMatches)
                    return
                }

                setMatches([])
            } catch (error) {
                setMatches([])
                setMessage("No se pudieron cargar los partidos.")
            }
        }

        loadMatches()
    }, [])

    const handleCreateMatch = async (newMatch) => {
        const payload = {
            date: `${newMatch.fecha}T00:00:00.000Z`,
            time: `1970-01-01T${newMatch.hora}:00.000Z`,
            location: newMatch.ubicacion,
            maxPlayers: newMatch.maxJugadores,
            state: "abierto",
            creatorId: Number(currentUser.id),
        }

        try {
            await createMatchRequest(payload)

            const response = await allMatches()
            const data = Array.isArray(response?.matches) ? response.matches : []

            setMatches(data.map(normalizeMatch).filter((m) => m.estado !== "cancelado" && m.estado !== "finalizado" && m.estado !== "completado"))
            setMessage("Partido creado correctamente.")
            setIsFormOpen(false)
        } 
        catch (error) {
            setMessage("No se pudo crear el partido.")
            setIsFormOpen(false)
        }
    }

    const handleJoinMatch = async (matchId) => {
    try {
        await joinMatchRequest(matchId)

        const response = await allMatches()
        const data = Array.isArray(response?.matches) ? response.matches : []

        setMatches(data.map(normalizeMatch).filter((m) => m.estado !== "cancelado" && m.estado !== "finalizado" && m.estado !== "completado"))
        setMessage("Te has apuntado al partido correctamente.")
    } catch (error) {
        setMessage(error.message || "No se pudo apuntar al partido.")
    }
    }
    const handleLeaveMatch = async (matchId) => {
    try {
        await leaveMatchRequest(matchId)
        const response = await allMatches()
        const data = Array.isArray(response?.matches) ? response.matches : []
        setMatches(data.map(normalizeMatch).filter((m) => m.estado !== "cancelado" && m.estado !== "finalizado"))
        setMessage("Te has desapuntado correctamente.")
    } catch (error) {
        setMessage(error.message || "No se pudo desapuntar.")
    }
}
    

    return (
        <main className="mainPage">
            <Nav />

            <section className={style.hero}>
                <h1>Partidos</h1>
                {message && <p>{message}</p>}
            </section>

            <section className={`${style.formGrid} ${isFormOpen ? style.formOpen : ""}`}>
                <aside className={style.aside}>
                    <div className={`cardBase ${style.panel} ${isFormOpen ? style.panelOpen : ""}`}>
                        <div className={style.panelTop}>
                            <h2>Crear partido</h2>

                            <button
                                className={`btnTwo ${style.btnForm}`}
                                type="button"
                                onClick={() => setIsFormOpen((prev) => !prev)}
                            >
                                {isFormOpen ? "Cerrar formulario" : "Abrir formulario"}
                            </button>
                        </div>

                        {isFormOpen ? (
                            <div className={style.formMatches}>
                                <CreateMatchForm onCreate={handleCreateMatch} />
                            </div>
                        ) : (
                            <p className={style.panelText}>
                                Abre el formulario para preparar un nuevo partido.
                            </p>
                        )}
                    </div>
                </aside>

                <section className={`cardBase ${style.listSection}`}>
                    <h2>Listado de partidos</h2>

                    <div className={style.list}>
                        {matches.map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                user={currentUser}
                                onJoin={handleJoinMatch}
                                onLeave={handleLeaveMatch}
                            />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    )
}