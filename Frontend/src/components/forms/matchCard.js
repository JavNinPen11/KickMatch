import { useState } from "react"
import style from "./styleForms/matchCard.module.scss"
import { formatMatchDate, getMatchDisplayName } from "../../api/matchUtils.js"


export function MatchCard({ match, user, onJoin, onLeave }) {
    const [showDetails, setShowDetails] = useState(false)
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
        <article className={`cardBase ${style.matchCard}`}>
            <div className={style.matchTop}>
                <h3>{getMatchDisplayName(match.fecha)}</h3>
                <span className="labelYellow">{match.estado || "ABIERTO"}</span>
            </div>

            <div className={style.matchInfo}>
                <p><strong>Fecha:</strong> {formatMatchDate(match.fecha)}</p>
                <p><strong>Hora:</strong> {match.hora}</p>
                <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                <p><strong>Organizador:</strong> {match.creador.nombre}</p>
                <p><strong>Jugadores:</strong> {match.jugadoresApuntados}/{match.maxJugadores}</p>

                {match.duracion ? (
                    <p><strong>Duración:</strong> {match.duracion} min</p>
                ) : null}
            </div>

            <button
                className={`btnTwo ${style.btnDetails}`}
                type="button"
                onClick={() => setShowDetails(true)}
            >
                Ver partido
            </button>

            <button
                className={`btnOne ${style.btnJoin}`}
                type="button"
                onClick={() => onJoin(match.id)}
                disabled={disabled}
            >
                {btnText}
            </button>
            {joined && !owner && (
                <button
                    className={`btnTwo ${style.btnLeave}`}
                    type="button"
                    onClick={() => onLeave(match.id)}
                >
                    Desapuntarme
                </button>
            )}
            {showDetails ? (
                <div className={style.matchModal}>
                    <article className={`cardBase ${style.matchModalCard}`}>
                        <button
                            className={style.btnClose}
                            type="button"
                            onClick={() => setShowDetails(false)}
                            aria-label="Cerrar"
                        >
                            x
                        </button>

                        <span className="labelYellow">Detalle del partido</span>

                        <h2>{getMatchDisplayName(match.fecha)}</h2>

                        <div className={style.matchModalInfo}>
                            <p><strong>Fecha:</strong> {formatMatchDate(match.fecha)}</p>
                            <p><strong>Hora:</strong> {match.hora}</p>
                            <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                            <p><strong>Organizador:</strong> {match.creador.nombre}</p>
                            <p><strong>Estado:</strong> {match.estado}</p>
                            <p><strong>Jugadores:</strong> {match.jugadoresApuntados}/{match.maxJugadores}</p>
                        </div>

                        <div className={style.playersList}>
                            <h3>Participantes</h3>

                            {match.participantes.length > 0 ? (
                                <ul>
                                    {match.participantes.map((participant) => (
                                        <li key={participant.id}>
                                            {participant.nombre || participant.username || "Jugador sin nombre"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="textBase">Todavía no hay participantes.</p>
                            )}
                        </div>
                    </article>
                </div>
            ) : null}
        </article>
    )
}