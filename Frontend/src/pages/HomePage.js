import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "../components/nav/Nav";
import { AuthContext } from "../context/authContext";
import {
    // formatMatchDate,
    getLocalMatches,
    // getMatchDisplayName,
} from "../api/matchService";
import "./css/HomePage.scss";


//array de la sección "Cómo funciona"
const howWorks = [
    {
        title: "Busca un partido",
        description:
            "Consulta los encuentros abiertos y revisa la fecha, la hora y las plazas disponibles.",
    },
    {
        title: "Apúntate o crea el tuyo",
        description:
            "Únete a una pachanga cercana o prepara un partido nuevo en pocos pasos.",
    },
    {
        title: "Organiza y juega",
        description:
            "Ten toda la información del partido clara para que solo quede reunirse y jugar.",
    },
];

// devuelve partidos para la home.
function getMatches() {
    return [];
    // devuelve partidos del backend al home.
}

export default function HomePage() {
    const { user } = useContext(AuthContext);
    const [featuredMatches] = useState([]);

    const isLogin = Boolean(user);

    return (
        <main className="home">
            <Nav variant="landing" />

            <div className="content">
                <section className="hero">
                    <div className="heroContent">
                        <span className="textSmall">KickMatch</span>

                        <h1 className="titleHero">
                            Encuentra tu próximo partido de fútbol
                        </h1>

                        <p className="textBase">
                            Crea partidos, apúntate a encuentros cerca de ti y conoce gente, o organiza
                            tus pachangas fácilmente.
                        </p>

                        <div className="heroActions">
                            <Link className="btnOne" to="/matches">
                                Ver partidos
                            </Link>

                            {isLogin ? (
                                <Link className="btnTwo" to="/my-matches">
                                    Ver mis partidos
                                </Link>
                            ) : (
                                <Link className="btnTwo" to="/register">
                                    Crear cuenta
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                <section className="section" id="partidos-recientes">
                    <div className="sectionHeading">
                        <h2 className="titleSection">Partidos más recientes</h2>

                        <p className="textBase">
                            Consulta los ultimos partidos subidos.
                        </p>
                    </div>

                  {/* card de partidos: */}
                    {/* <div className="matchesGrid">
                        {featuredMatches.map((match) => (
                            <article className="matchCard" key={match.id}>
                                <div className="matchCardHeader">
                                    <h3 className="titleCard">
                                        {getMatchDisplayName(match.fecha)}
                                    </h3>

                                    <span className="status">
                                        {match.estado?.toLowerCase() === "abierto"
                                            ? "Abierto"
                                            : match.estado}
                                    </span>
                                </div>

                                <div className="matchDetails">
                                    <p className="textBase">
                                        <strong>Fecha:</strong> {formatMatchDate(match.fecha)}
                                    </p>

                                    <p className="textBase">
                                        <strong>Hora:</strong> {match.hora}
                                    </p>

                                    <p className="textBase">
                                        <strong>Ubicación:</strong> {match.ubicacion}
                                    </p>

                                    <p className="textBase">
                                        <strong>Organizador:</strong> {match.creador.nombre}
                                    </p>

                                    <p className="textBase">
                                        <strong>Plazas:</strong> {match.jugadoresApuntados}/
                                        {match.maxJugadores}
                                    </p>

                                    <p className="textBase">
                                        <strong>Duración:</strong> {match.duracion || 60} min
                                    </p>
                                </div>

                                <div className="cardActions">
                                    <Link
                                        className="btnTwo"
                                        to={`/matches/${match.id}`}
                                    >
                                        Ver partido
                                    </Link>

                                    <Link
                                        className="btnOne"
                                        to={isLogin ? "/my-matches" : "/login"}
                                        // si no esta en loggeado lo redirige al login 
                                    
                                    >
                                        {isLogin ? "Ver mis partidos" : "Apuntarme"}

                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div> */}
                </section>

                <section className="section">
                    <div className="sectionHeading">
                        <h2 className="titleSection">
                            Organiza tus pachangas sin complicarte
                        </h2>
                    </div>
                    {/* para hacerlo mas facil de editar el texto, reutilizable, limpio etc
     tenemos el array howWorks y aqui lo recorremos con un map y lo pintamos */}
                    <div className="stepsGrid">
                        {howWorks.map((item, index) => (
                            <article className="stepCard" key={item.title}>
                                <span className="stepNumber">0{index + 1}</span>
                                <h3 className="titleCard">{item.title}</h3>
                                <p className="textBase">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cta">
                    <div className="ctaContent">
                        <h2 className="titleSection">¿Listo para jugar?</h2>

                        <p className="textBase">
                            {isLogin
                                ? "Entra en tu panel o revisa los partidos abiertos para organizar tu siguiente pachanga."
                                : "Regístrate y empieza a unirte o crear partidos de fútbol cerca de ti."}
                        </p>

                        <div className="heroActions">
                            {isLogin ? (
                                <Link className="btnOne" to="/dashboard">
                                    Ir a tu dashboard
                                </Link>
                            ) : (
                                <Link className="btnOne" to="/register">
                                    Registrarme
                                </Link>
                            )}

                            <Link className="btnTwo" to="/matches">
                                Explorar partidos
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}