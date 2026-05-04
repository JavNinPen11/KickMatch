import { Link } from "react-router-dom";
import { formatMatchDate, getMatchDisplayName } from "../../api/matchUtils";
import "./MatchCard.css"

export function MatchCard({ match, currentUser, onJoin }) {
    const isComplete = match.jugadoresApuntados >= match.maxJugadores
    const isOwner = String(match.creador.id) === String(currentUser.id)
    const alreadyJoined = match.participantes.some(
        (participant) => String(participant.id) === String(currentUser.id)
    )

    let joinLabel = "Apuntarme"

    if (isComplete) {
        joinLabel = "Completo"
    } else if (isOwner) {
        joinLabel = "Tu partido"
    } else if (alreadyJoined) {
        joinLabel = "Apuntado"
    }

    return (
        <article className="matchCard">
            <div className="matchCardHeader">
                <h3>{getMatchDisplayName(match.fecha)}</h3>
                <span className="matchStatus">{match.estado || "ABIERTO"}</span>
            </div>

            <div className="matchMeta">
                <p><strong>Fecha:</strong> {formatMatchDate(match.fecha)}</p>
                <p><strong>Hora:</strong> {match.hora}</p>
                <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                <p><strong>Organizador:</strong> {match.creador.nombre}</p>
                <p><strong>Máx. jugadores:</strong> {match.maxJugadores}</p>
                <p><strong>Apuntados:</strong> {match.jugadoresApuntados}/{match.maxJugadores}</p>
                {match.duracion ? <p><strong>Duración:</strong> {match.duracion} min</p> : null}
            </div>

            <Link className="detailsButton" to={`/matches/${match.id}`}>
                Ver partido
            </Link>
            <button
                className="joinButton"
                type="button"
                onClick={() => onJoin(match.id)}
                disabled={isComplete || isOwner || alreadyJoined}
            >
                {joinLabel}
            </button>
        </article>
    )
}
