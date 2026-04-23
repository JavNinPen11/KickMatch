import { useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { Nav } from "../components/nav/Nav"
import { AuthContext } from "../context/authContext"
import { getMatchUser } from "../utils/userMatches"
import "./css/MatchDetailPage.scss"

export default function MatchDetailPage() {
    //falta poner la 
    const { matchId } = useParams()
    const { user } = useContext(AuthContext)
    const currentUser = getMatchUser(user)

    return (
        <main className="matchDetail">
            <Nav />

            <section className="content">
                <div className="header">
                    <div className="headerText">
                        <span className="labelYellow">Detalle del partido</span>
                        <h1>Partido {matchId}</h1>
                        <p>
                            Esta vista quedará conectada al backend para mostrar toda la
                            información del partido y las personas participantes.
                        </p>
                    </div>

                    <div className="headerBtns">
                        <Link className="btnOne" to="/matches">
                            Volver a partidos
                        </Link>
                        <Link className="btnTwo" to="/dashboard">
                            Ir al dashboard
                        </Link>
                    </div>
                </div>

                <article className="card">
                    <div className="cardTop">
                        <h2>Información pendiente</h2>
                    </div>

                    <div className="cardInfo">
                        <p>
                            Cuando conectemos esta página al backend, aquí se verá el detalle
                            completo del partido seleccionado.
                        </p>
                        <p>
                            Usuario actual: <strong>{currentUser.nombre}</strong>
                        </p>
                    </div>

                     {/* en progeso */}
                </article>
            </section>
        </main>
    )
}