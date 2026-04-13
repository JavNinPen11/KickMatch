import { useContext, useEffect, useState } from "react";
import { Nav } from "../components/nav/Nav";
import { CreateMatchForm } from "../components/forms/CreateMatchForm";
import { MatchCard } from "../components/matches/MatchCard";
import { AuthContext } from "../context/authContext";
import {
    createMatchRequest,
    getLocalMatches,
    getMatchesRequest,
    normalizeMatch,
    saveLocalMatches,
} from "../api/matchService";
import "./MatchesPage.css"

function getCurrentMatchUser(user) {
    if (!user) {
        return { id: "guest-user", nombre: "Invitado" }
    }

    return {
        id: user.id ?? user.username ?? "guest-user",
        nombre: user.nombre ?? user.username ?? "Invitado",
    }
}

export default function MatchesPage() {
    const { user } = useContext(AuthContext)
    const currentUser = getCurrentMatchUser(user)
    const [matches, setMatches] = useState([])
    const [message, setMessage] = useState("Mostrando partidos locales mientras terminamos el backend.")

    useEffect(() => {
        // Intenta cargar datos reales y, si no existen, mantiene la fuente local compartida.
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
                // Seguimos con localStorage para poder avanzar en frontend.
            }

            setMessage("Mostrando partidos locales mientras terminamos el backend.")
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
        } catch (error) {
            const nextMatches = [matchToAdd, ...matches]
            persistMatches(nextMatches)
            setMessage("Partido añadido en local. El backend de partidos aún no está conectado.")
        }
    }

    const handleJoinMatch = (matchId) => {
        // La inscripción sigue siendo local hasta que exista persistencia real.
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

    return (
        <main className="matchesPage">
            <Nav />

            <section className="matchesHero">
                <h1>Partidos</h1>
                <p>{message}</p>
            </section>

            <section className="matchesLayout">
                <aside className="createMatchPanel">
                    <h2>Crear partido</h2>
                    <CreateMatchForm onCreateMatch={handleCreateMatch} />
                </aside>

                <section className="matchesListSection">
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
