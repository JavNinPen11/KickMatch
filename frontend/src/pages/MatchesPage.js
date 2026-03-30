import { useEffect, useState } from "react";
import { Nav } from "../components/nav/Nav";
import { CreateMatchForm } from "../components/forms/CreateMatchForm";
import { MatchCard } from "../components/matches/MatchCard";
import { getMatchesRequest, createMatchRequest } from "../api/matchService";
import "./MatchesPage.css"

const mockMatches = [
    {
        id: 1,
        fecha: "2026-04-02",
        hora: "19:30",
        ubicacion: "Polideportivo Norte",
        maxJugadores: 10,
        estado: "abierto",
    },
    {
        id: 2,
        fecha: "2026-04-04",
        hora: "21:00",
        ubicacion: "Pista Central",
        maxJugadores: 14,
        estado: "completo",
    },
]

export default function MatchesPage() {
    const [matches, setMatches] = useState(mockMatches)
    const [message, setMessage] = useState("Mostrando partidos locales mientras terminamos el backend.")

    useEffect(() => {
        // Intenta cargar datos reales y, si no existen, mantiene los mocks locales.
        const loadMatches = async () => {
            try {
                const response = await getMatchesRequest()
                const data = Array.isArray(response?.data) ? response.data : response

                if (Array.isArray(data) && data.length > 0) {
                    setMatches(data)
                    setMessage("Partidos cargados desde el servidor.")
                }
            } catch (error) {
                setMessage("Mostrando partidos locales mientras terminamos el backend.")
            }
        }

        loadMatches()
    }, [])

    const handleCreateMatch = async (newMatch) => {
        // Se genera un id local para poder pintar el nuevo partido al instante.
        const matchToAdd = {
            id: Date.now(),
            ...newMatch,
            estado: newMatch.estado || "abierto",
        }

        try {
            const response = await createMatchRequest(matchToAdd)
            const createdMatch = response?.data || response

            setMatches((prev) => [createdMatch, ...prev])
            setMessage("Partido creado correctamente.")
        } catch (error) {
            // Fallback local para seguir construyendo la UI sin backend.
            setMatches((prev) => [matchToAdd, ...prev])
            setMessage("Partido añadido en local. El backend de partidos aún no está conectado.")
        }
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
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    )
}
