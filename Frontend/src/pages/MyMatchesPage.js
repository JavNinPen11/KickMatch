import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "../components/nav/Nav";
import { MatchCard } from "../components/matches/MatchCard";
import { AuthContext } from "../context/authContext";
import { getLocalMatches } from "../api/matchService";
import { getCurrentMatchUser, getUserMatchesSummary } from "../utils/userMatches";
import "./css/MyMatchesPage.css";

function EmptyState({ title, description }) {
    return (
        <article className="myEmpty">
            <h3>{title}</h3>
            <p>{description}</p>
            <Link className="myBtn myBtnMain" to="/matches">
                Ir a partidos
            </Link>
        </article>
    );
}

export default function MyMatchesPage() {
    const { user } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        setMatches(getLocalMatches());
    }, []);

    const currentUser = useMemo(() => getCurrentMatchUser(user), [user]);
    const { upcomingMatches, createdMatches, joinedMatches } = useMemo(
        () => getUserMatchesSummary(matches, user),
        [matches, user]
    );

    const stats = [
        { label: "Próximos partidos", value: upcomingMatches.length },
        { label: "Creados por mí", value: createdMatches.length },
        { label: "Apuntado", value: joinedMatches.length },
    ];

    // Secciones: cabecera, próximos partidos, creados por mí y apuntados
    return (
        <main className="myPage">
            <Nav />

            <div className="myWrap">
                <section className="myHero">
                    <article className="myCard">
                        <span className="myTag">Zona personal</span>
                        <h1>Mis partidos</h1>
                        <p>
                            Aquí tienes tus partidos organizados por bloques para ver rápido
                            qué tienes pendiente, qué has creado y en qué encuentros estás apuntado.
                        </p>

                        <div className="myBtns">
                            <Link className="myBtn myBtnMain" to="/matches">
                                Ver todos los partidos
                            </Link>
                            <Link className="myBtn myBtnAlt" to="/dashboard">
                                Volver al dashboard
                            </Link>
                        </div>
                    </article>

                    <aside className="myCard mySide">
                        <div className="myHead">
                            <span className="myTag">Resumen</span>
                            <h2>{currentUser.username}</h2>
                        </div>

                        <div className="myStats">
                            {stats.map((item) => (
                                <article className="myStat" key={item.label}>
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </article>
                            ))}
                        </div>
                    </aside>
                </section>

                <section className="mySection">
                    <div className="myHead">
                        <span className="myTag">Próximos partidos</span>
                        <h2>Lo que tienes por delante</h2>
                    </div>

                    {upcomingMatches.length > 0 ? (
                        <div className="myGrid">
                            {upcomingMatches.map((match) => (
                                <MatchCard
                                    key={`upcoming-${match.id}`}
                                    match={match}
                                    currentUser={currentUser}
                                    onJoin={() => {}}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No tienes próximos partidos"
                            description="Todavía no hay encuentros futuros relacionados contigo. Puedes crear uno o apuntarte desde la vista general."
                        />
                    )}
                </section>

                <section className="mySection">
                    <div className="myHead">
                        <span className="myTag">Creados por mí</span>
                        <h2>Partidos que organizas</h2>
                    </div>

                    {createdMatches.length > 0 ? (
                        <div className="myGrid">
                            {createdMatches.map((match) => (
                                <MatchCard
                                    key={`created-${match.id}`}
                                    match={match}
                                    currentUser={currentUser}
                                    onJoin={() => {}}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No has creado partidos todavía"
                            description="Cuando organices tu primer partido aparecerá aquí para que puedas localizarlo más rápido."
                        />
                    )}
                </section>

                <section className="mySection">
                    <div className="myHead">
                        <span className="myTag">Estoy apuntado</span>
                        <h2>Partidos en los que participas</h2>
                    </div>

                    {joinedMatches.length > 0 ? (
                        <div className="myGrid">
                            {joinedMatches.map((match) => (
                                <MatchCard
                                    key={`joined-${match.id}`}
                                    match={match}
                                    currentUser={currentUser}
                                    onJoin={() => {}}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No estás apuntado a ningún partido"
                            description="Todavía no participas en ningún encuentro. Entra en partidos y apúntate al que mejor te encaje."
                        />
                    )}
                </section>
            </div>
        </main>
    );
}
