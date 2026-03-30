import "./MatchCard.css"

export function MatchCard({ match }) {
    return (
        <article className="matchCard">
            <div className="matchCardHeader">
                <h3>Partido</h3>
                <span className="matchStatus">{match.estado || "abierto"}</span>
            </div>
            <p><strong>Fecha:</strong> {match.fecha}</p>
            <p><strong>Hora:</strong> {match.hora}</p>
            <p><strong>Ubicación:</strong> {match.ubicacion}</p>
            <p><strong>Máx. jugadores:</strong> {match.maxJugadores}</p>
        </article>
    )
}
