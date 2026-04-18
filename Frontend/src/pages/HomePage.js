import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "../components/nav/Nav";
import { AuthContext } from "../context/authContext";
import {
    formatMatchDate,
    getLocalMatches,
    getMatchDisplayName,
} from "../api/matchService";
import "./css/HomePage.css";

const featuredFallbackMatches = [
    {
        id: "home-1",
        fecha: "2026-04-22",
        hora: "20:00",
        ubicacion: "Polideportivo La Estrella",
        maxJugadores: 10,
        jugadoresApuntados: 6,
        participantes: [],
        creador: { id: "mario", nombre: "Mario" },
        duracion: 60,
        estado: "ABIERTO",
    },
    {
        id: "home-2",
        fecha: "2026-04-24",
        hora: "19:30",
        ubicacion: "Campo Municipal Norte",
        maxJugadores: 14,
        jugadoresApuntados: 9,
        participantes: [],
        creador: { id: "laura", nombre: "Laura" },
        duracion: 90,
        estado: "ABIERTO",
    },
    {
        id: "home-3",
        fecha: "2026-04-26",
        hora: "11:00",
        ubicacion: "Centro Deportivo San Miguel",
        maxJugadores: 12,
        jugadoresApuntados: 8,
        participantes: [],
        creador: { id: "david", nombre: "David" },
        duracion: 75,
        estado: "ABIERTO",
    },
];

const howItWorksItems = [
    {
        title: "Busca un partido",
        description: "Consulta los encuentros abiertos y revisa la fecha, la hora y las plazas disponibles.",
    },
    {
        title: "Apúntate o crea el tuyo",
        description: "Únete a una pachanga cercana o prepara un partido nuevo en pocos pasos.",
    },
    {
        title: "Organiza y juega",
        description: "Ten toda la información del partido clara para que solo quede reunirse y jugar.",
    },
];

function getFeaturedMatches() {
    const localMatches = getLocalMatches();

    if (Array.isArray(localMatches) && localMatches.length > 0) {
        return localMatches.slice(0, 3);
    }

    return featuredFallbackMatches;
}

export default function HomePage() {
    const { user } = useContext(AuthContext);
    const [featuredMatches, setFeaturedMatches] = useState(featuredFallbackMatches);
    const isAuthenticated = Boolean(user);

    useEffect(() => {
        setFeaturedMatches(getFeaturedMatches());
    }, []);

    // Secciones: hero, partidos destacados, cómo funciona y CTA final
    return (
        <main className="homePage">
            <Nav variant="landing" />

            <div className="homeContent">
                <section className="homeHero">
                    <div className="homeHeroContent">
                        <span className="homeEyebrow">KickMatch</span>
                        <h1>Encuentra tu próximo partido de fútbol</h1>
                        <p>
                            Crea partidos, apúntate a encuentros cerca de ti y organiza
                            tus pachangas fácilmente.
                        </p>

                        <div className="homeHeroActions">
                            <Link className="homeButton homeButtonPrimary" to="/matches">
                                Ver partidos
                            </Link>
                            {isAuthenticated ? (
                                <Link className="homeButton homeButtonSecondary" to="/my-matches">
                                    Ver mis partidos
                                </Link>
                            ) : (
                                <Link className="homeButton homeButtonSecondary" to="/register">
                                    Crear cuenta
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                <section className="homeSection" id="partidos-abiertos">
                    <div className="homeSectionHeading">
                        <span className="homeSectionEyebrow">Partidos destacados</span>
                        <h2>Partidos abiertos</h2>
                        <p>
                            Una vista rápida de los encuentros que ahora mismo están listos
                            para completar jugadores.
                        </p>
                    </div>

                    <div className="homeMatchesGrid">
                        {featuredMatches.map((match) => (
                            <article className="homeMatchCard" key={match.id}>
                                <div className="homeMatchCardHeader">
                                    <h3>{getMatchDisplayName(match.fecha)}</h3>
                                    <span className="homeStatus">
                                        {match.estado?.toLowerCase() === "abierto" ? "Abierto" : match.estado}
                                    </span>
                                </div>

                                <div className="homeMatchDetails">
                                    <p><strong>Fecha:</strong> {formatMatchDate(match.fecha)}</p>
                                    <p><strong>Hora:</strong> {match.hora}</p>
                                    <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                                    <p><strong>Organizador:</strong> {match.creador.nombre}</p>
                                    <p>
                                        <strong>Plazas:</strong> {match.jugadoresApuntados}/{match.maxJugadores}
                                    </p>
                                    <p><strong>Duración:</strong> {match.duracion || 60} min</p>
                                </div>

                                <div className="homeCardActions">
                                    <Link className="homeButton homeButtonSecondary" to={`/matches/${match.id}`}>
                                        Ver partido
                                    </Link>
                                    <Link
                                        className="homeButton homeButtonPrimary"
                                        to={isAuthenticated ? "/my-matches" : "/login"}
                                    >
                                        {isAuthenticated ? "Ver mis partidos" : "Apuntarme"}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="homeSection">
                    <div className="homeSectionHeading">
                        <span className="homeSectionEyebrow">Cómo funciona</span>
                        <h2>Organiza tus pachangas sin complicarte</h2>
                    </div>

                    <div className="homeStepsGrid">
                        {howItWorksItems.map((item, index) => (
                            <article className="homeStepCard" key={item.title}>
                                <span className="homeStepNumber">0{index + 1}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="homeCtaSection">
                    <div className="homeCtaContent">
                        <span className="homeSectionEyebrow">KickMatch</span>
                        <h2>Listo para jugar?</h2>
                        <p>
                            {isAuthenticated
                                ? "Entra en tu panel o revisa los partidos abiertos para organizar tu siguiente pachanga."
                                : "Regístrate y empieza a unirte o crear partidos de fútbol cerca de ti."}
                        </p>

                        <div className="homeHeroActions">
                            {isAuthenticated ? (
                                <Link className="homeButton homeButtonPrimary" to="/matches">
                                    Ir a partidos
                                </Link>
                            ) : (
                                <Link className="homeButton homeButtonPrimary" to="/register">
                                    Registrarme
                                </Link>
                            )}
                            <Link className="homeButton homeButtonSecondary" to="/matches">
                                Explorar partidos
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
