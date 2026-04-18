import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Nav } from "../components/nav/Nav";
import { AuthContext } from "../context/authContext";
import { formatMatchDate, getLocalMatchById } from "../api/matchService";
import "./css/MatchDetailPage.css"

function getCurrentMatchUser(user) {
    if (!user) {
        return { id: "guest-user", nombre: "Invitado" }
    }

    return {
        id: user.id ?? user.username ?? "guest-user",
        nombre: user.nombre ?? user.username ?? "Invitado",
    }
}

export default function MatchDetailPage() {
    const { matchId } = useParams()
    const { user } = useContext(AuthContext)
    const currentUser = getCurrentMatchUser(user)
    const [match, setMatch] = useState(null)

    useEffect(() => {
        setMatch(getLocalMatchById(matchId))
    }, [matchId])

    if (!match) {
        return (
            <main className="matchDetailPage">
                <Nav />
                <section className="matchDetailShell">
                    <h1>Partido no encontrado</h1>
                    <p>No hemos podido cargar este partido con la información guardada en local.</p>
                </section>
            </main>
        )
    }

    const isOwner = String(match.creador.id) === String(currentUser.id)
    const visiblePeople = [
        {
            id: `organizer-${match.creador.id}`,
            nombre: match.creador.nombre,
            rol: "Organizador",
        },
        ...match.participantes
            .filter((participant) => String(participant.id) !== String(match.creador.id))
            .map((participant) => ({
                id: participant.id,
                nombre: participant.nombre,
                rol: "Apuntado",
            })),
    ]

    return (
        <main className="matchDetailPage">
            <Nav />

            <section className="matchDetailShell">
                <div className="matchDetailHeader">
                    <h1>Detalle del partido</h1>
                    <span className="matchDetailStatus">{match.estado}</span>
                </div>

                <section className="matchDetailCard">
                    <p><strong>Fecha:</strong> {formatMatchDate(match.fecha)}</p>
                    <p><strong>Hora:</strong> {match.hora}</p>
                    <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                    {match.duracion ? <p><strong>Duración:</strong> {match.duracion} min</p> : null}
                    <p><strong>Máx. jugadores:</strong> {match.maxJugadores}</p>
                    <p><strong>Apuntados:</strong> {match.jugadoresApuntados}/{match.maxJugadores}</p>
                    <p><strong>Organizador:</strong> {match.creador.nombre}</p>
                    {isOwner ? <p className="matchDetailHint">Eres el organizador de este partido.</p> : null}
                </section>

                <section className="participantsSection">
                    <h2>Personas del partido</h2>
                    <ul className="participantsList">
                        {visiblePeople.map((person) => (
                            <li key={person.id} className="participantItem">
                                <span>{person.nombre}</span>
                                <span className="participantRole">{person.rol}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </section>
        </main>
    )
}
