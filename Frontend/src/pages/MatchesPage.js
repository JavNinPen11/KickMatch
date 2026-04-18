import { useContext, useEffect, useState } from "react";
import { Nav } from "../components/nav/Nav";
import { CreateMatchForm } from "../components/forms/CreateMatchForm";
import { MatchCard } from "../components/matches/MatchCard";
import { AuthContext } from "../context/authContext";
import { getCurrentMatchUser } from "../utils/userMatches";
import {
    createMatchRequest,
    getLocalMatches,
    getMatchesRequest,
    normalizeMatch,
    saveLocalMatches,
} from "../api/matchService";
import "./css/MatchesPage.css"

export default function MatchesPage() {
    const { user } = useContext(AuthContext)
    const currentUser = getCurrentMatchUser(user)
    const [matches, setMatches] = useState([])
    const [message, setMessage] = useState("Mostrando partidos guardados en local.")
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        // Si falta por conectar, se usan los datos guardados en local.
        const loadMatches = async () => {
            const localMatches = getLocalMatches()
            setMatches(localMatches)

            try {
                const response = await getMatchesRequest()
                const data = Array.isArray(response?.data) ? response.data : response

                if (Array.isArray(data) && data.length > 0) {
                    const normalizedMatches = data.map(normalizeMatch)
                    setMatches(normalizedMatches)
                    saveLocalMatches(normalizedMatches)
                    setMessage("Partidos cargados desde el servidor.")
                    return
                }
            } catch (error) {
                // De momento se mantiene la información guardada en local.
            }

            setMessage("Mostrando partidos guardados en local.")
        }

        loadMatches()
    }, [])

    const persistMatches = (nextMatches) => {
        setMatches(nextMatches)
        saveLocalMatches(nextMatches)
    }

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
            const nextMatches = [createdMatch, ...matches]
            persistMatches(nextMatches)
            setMessage("Partido creado correctamente.")
            setIsFormOpen(false)
        } catch (error) {
            const nextMatches = [matchToAdd, ...matches]
            persistMatches(nextMatches)
            setMessage("Partido guardado en local. Pendiente de conectar.")
            setIsFormOpen(false)
        }
    }

    const handleJoinMatch = (matchId) => {
        // La inscripción se guarda en local.
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

        persistMatches(nextMatches)
    }

    // Layout de partidos: panel sticky a la izquierda y listado a la derecha
    return (
        <main className="matchesPage">
            <Nav />

            <section className="matchesHero">
                <h1>Partidos</h1>
                <p>{message}</p>
            </section>

            <section className={`matchesLayout ${isFormOpen ? "matchesLayoutOpen" : ""}`}>
                <aside className="matchesSide">
                    <div className={`createMatchPanel ${isFormOpen ? "createMatchPanelOpen" : ""}`}>
                    <div className="createMatchHeader">
                        <h2>Crear partido</h2>
                        <button
                            className="toggleCreateButton"
                            type="button"
                            onClick={() => setIsFormOpen((prev) => !prev)}
                        >
                            {isFormOpen ? "Cerrar formulario" : "Abrir formulario"}
                        </button>
                    </div>

                    {isFormOpen ? (
                        <div className="createMatchFormWrap">
                            <CreateMatchForm onCreateMatch={handleCreateMatch} />
                        </div>
                    ) : (
                        <p className="createMatchHint">
                            Abre el panel para preparar un nuevo partido sin salir del listado.
                        </p>
                    )}
                    </div>
                </aside>

                <section className={`matchesListSection ${isFormOpen ? "matchesListMuted" : ""}`}>
                    <h2>Listado de partidos</h2>
                    <div className="matchesList">
                        {matches.map((match) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                currentUser={currentUser}
                                onJoin={handleJoinMatch}
                            />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    )
}
