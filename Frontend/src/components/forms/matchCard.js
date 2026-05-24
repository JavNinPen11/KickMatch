
import { Link } from "react-router-dom"
import style from "./styleForms/matchCard.module.scss"
import { formatMatchDate, getMatchDisplayName } from "../../api/matchUtils.js"


export function MatchCard({ match, user, onJoin, onCancel }) {
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

            <Link className={`btnTwo ${style.btnDetails}`} to={`/matches/${match.id}`}>
                Ver partido
            </Link>

            <button
                className={`btnOne ${style.btnJoin}`}
                type="button"
                onClick={() => onJoin(match.id)}
                disabled={disabled}
            >
                {btnText}
            </button>
            
            {owner && match.estado !== "cancelado" ? (
                <button
                    className={`btnTwo ${style.btnCancel}`}
                    type="button"
                    onClick={() => onCancel(match.id)}
                >
                    Cancelar partido
                </button>
            ) : null}
        </article>
    )
}