import { useContext, useEffect, useState } from "react"
import { Nav } from "../components/nav/Nav"
import { CreateMatchForm } from "../components/forms/CreateMatchForm"
import { MatchCard } from "../components/forms/matchCard"
import { AuthContext } from "../context/authContext"
import { getMatchUser } from "../utils/userMatches"
import {createMatchRequest, myMatchesRequest, normalizeMatch} from "../api/matchUtils"
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
                const response = await myMatchesRequest()
                const data = Array.isArray(response?.matches) ? response.matches : []

                if (Array.isArray(data)) {
                    const normalizedMatches = data.map(normalizeMatch)
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
        const matchToAdd = normalizeMatch({
            id: Date.now(),
            ...newMatch,
            jugadoresApuntados: 0,
            participantes: [],
            creador: currentUser,
            estado: "ABIERTO",
        })

        try {
            const response = await createMatchRequest(matchToAdd)
            const createdMatch = normalizeMatch(response?.data || response)

            setMatches((prevMatches) => [createdMatch, ...prevMatches])
            setMessage("Partido creado correctamente.")
            setIsFormOpen(false)
        } catch (error) {
            setMessage("No se pudo crear el partido.")
            setIsFormOpen(false)
        }
    }

    const handleJoinMatch = (matchId) => {
        const nextMatches = matches.map((match) => {
            const alreadyJoined = match.participantes.some(
                (participant) => String(participant.id) === String(currentUser.id)
            )
            const isOwner = String(match.creador.id) === String(currentUser.id)
            const isComplete = match.jugadoresApuntados >= match.maxJugadores

            if (String(match.id) !== String(matchId) || alreadyJoined || isOwner || isComplete) {
                return match
            }

            const participantes = [
                ...match.participantes,
                { id: currentUser.id, nombre: currentUser.nombre },
            ]

            const jugadoresApuntados = participantes.length

            return normalizeMatch({
                ...match,
                participantes,
                jugadoresApuntados,
            })
        })

        setMatches(nextMatches)
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
                            />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    )
}