
import { Link } from "react-router-dom"
import { formatMatchDate, getMatchDisplayName } from "../../api/matchUtils.js"
import "./MatchCard.scss"

export function MatchCard({ match, user, onJoin }) {
    const full = match.jugadoresApuntados >= match.maxJugadores
    const owner = String(match.creador.id) === String(user.id)

    const joined = match.participantes.some(
        (p) => String(p.id) === String(user.id)
    )

    const disabled = full || owner || joined

    let btnText = "Apuntarme"

    if (full) btnText = "Completo"
    if (owner) btnText = "Tu partido"
    if (joined) btnText = "Apuntado"

    return (
        <article className="matchCard">
            <div className="matchTop">
                <h3>{getMatchDisplayName(match.fecha)}</h3>
                <span>{match.estado || "ABIERTO"}</span>
            </div>

            <div className="matchInfo">
                <p><strong>Fecha:</strong> {formatMatchDate(match.fecha)}</p>
                <p><strong>Hora:</strong> {match.hora}</p>
                <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                <p><strong>Organizador:</strong> {match.creador.nombre}</p>
                <p><strong>Jugadores:</strong> {match.jugadoresApuntados}/{match.maxJugadores}</p>

                {match.duracion && (
                    <p><strong>Duración:</strong> {match.duracion} min</p>
                )}
            </div>

            <Link className="btnDetails" to={`/matches/${match.id}`}>
                Ver partido
            </Link>

            <button
                className="btnJoin"
                type="button"
                onClick={() => onJoin(match.id)}
                disabled={disabled}
            >
                {btnText}
            </button>
        </article>
    )
}