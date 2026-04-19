import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "../components/nav/Nav";
import { AuthContext } from "../context/authContext";
import { getLocalMatches, formatMatchDate, getMatchDisplayName } from "../api/matchService";
import { getMeRequest } from "../api/userService";
import { getUserMatchesSummary } from "../utils/userMatches";
import "./css/DashboardPage.css";

function getStatusLabel(status) {
  return status?.toLowerCase() === "abierto" ? "Abierto" : status || "Activo";
}

function buildRecentActivity(summary) {
  const created = summary.createdMatches.slice(0, 2).map((match) => ({
    id: `created-${match.id}`,
    title: "Has creado un partido",
    description: `${match.ubicacion} · ${formatMatchDate(match.fecha)} a las ${match.hora}`,
    time: "Organizador",
  }));

  const joined = summary.joinedMatches.slice(0, 2).map((match) => ({
    id: `joined-${match.id}`,
    title: "Sigues apuntado a un partido",
    description: `${match.ubicacion} · ${formatMatchDate(match.fecha)} · ${match.jugadoresApuntados}/${match.maxJugadores} plazas`,
    time: getStatusLabel(match.estado),
  }));

  if (created.length === 0 && joined.length === 0) {
    return [{
      id: "empty",
      title: "Todavía no tienes actividad reciente",
      description: "Cuando crees o te apuntes a partidos verás aquí un resumen rápido.",
      time: "Pendiente",
    }];
  }

  return [...created, ...joined].slice(0, 4);
}

export const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    setMatches(getLocalMatches());
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getMeRequest(user.token);
        setProfile(res.data);
        setMessage("");
      } catch (error) {
        setMessage(error.message);
      }
    };

    if (user?.token) {
      loadProfile();
    }
  }, [user]);

  const summary = useMemo(
    () => getUserMatchesSummary(matches, user, profile),
    [matches, user, profile]
  );

  const recent = useMemo(() => buildRecentActivity(summary), [summary]);
  const nextMatches = summary.upcomingMatches.slice(0, 2);
  const stats = [
    { label: "Próximos partidos", value: summary.upcomingMatches.length },
    { label: "Creados por mí", value: summary.createdMatches.length },
    { label: "Apuntado", value: summary.joinedMatches.length },
    { label: "Jugados", value: summary.playedMatches.length },
  ];

  // Secciones: cabecera, resumen, próximos partidos, actividad, acciones rápidas y perfil
  return (
    <main className="dashPage">
      <Nav />

      <div className="dashWrap">
        <section className="dashHero">
          <article className="dashCard">
            <span className="dashTag">Zona privada</span>
            <h1>Hola, {summary.currentUser.username}</h1>
            <p>
              Aquí tienes un resumen claro de tu actividad en KickMatch y accesos
              rápidos para ir a la zona de partidos cuando lo necesites.
            </p>

            <div className="dashBtns">
              <Link className="dashBtn dashBtnMain" to="/my-matches">
                Ver mis partidos
              </Link>
              <Link className="dashBtn dashBtnAlt" to="/matches">
                Ver todos los partidos
              </Link>
            </div>
          </article>

          <aside className="dashCard dashSide">
            <span className="dashTag">Resumen del usuario</span>
            <div className="dashRow">
              <div className="dashTile">
                <span>Usuario</span>
                <strong>{summary.currentUser.username}</strong>
              </div>
              <div className="dashTile">
                <span>Rol</span>
                <strong>{summary.currentUser.rol || "Jugador"}</strong>
              </div>
            </div>
            <div className="dashTile">
              <span>Estado actual</span>
              <p>
                Tienes {summary.upcomingMatches.length} partido{summary.upcomingMatches.length === 1 ? "" : "s"} próximos
                y {summary.createdMatches.length} creado{summary.createdMatches.length === 1 ? "" : "s"} por ti.
              </p>
            </div>
          </aside>
        </section>

        <section className="dashSection">
          <div className="dashHead">
            <span className="dashTag">Resumen</span>
            <h2>Tu actividad en un vistazo</h2>
            <p>Estos datos usan la misma lógica local que la futura vista de mis partidos.</p>
          </div>

          <div className="dashStats">
            {stats.map((stat) => (
              <article className="dashCard dashStat" key={stat.label}>
                <span className="dashLabel">{stat.label}</span>
                <strong className="dashValue">{stat.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="dashSection dashMain">
          <div>
            <section className="dashSection">
              <div className="dashHead">
                <span className="dashTag">Próximos partidos</span>
                <h2>Resumen rápido de tu agenda</h2>
                <p>Si quieres gestionar el detalle completo, entra en tu vista de mis partidos.</p>
              </div>

              <div className="dashGrid">
                {nextMatches.length > 0 ? (
                  nextMatches.map((match) => (
                    <article className="dashCard dashMatch" key={match.id}>
                        <div className="dashTop">
                          <div>
                            <h3>{getMatchDisplayName(match.fecha)}</h3>
                          </div>
                          <span className="dashStatus">{getStatusLabel(match.estado)}</span>
                        </div>

                      <div className="dashMeta">
                        <p><strong>Fecha</strong>{formatMatchDate(match.fecha)}</p>
                        <p><strong>Hora</strong>{match.hora}</p>
                        <p><strong>Ubicación</strong>{match.ubicacion}</p>
                        <p><strong>Plazas</strong>{match.jugadoresApuntados}/{match.maxJugadores}</p>
                      </div>

                      <div className="dashBtns">
                        <Link className="dashBtn dashBtnAlt" to={`/matches/${match.id}`}>
                          Ver partido
                        </Link>
                        <Link className="dashBtn dashBtnMain" to="/my-matches">
                          Ver mis partidos
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <article className="dashCard dashMatch">
                    <div className="dashTop">
                      <div>
                        <h3>Aún no tienes próximos partidos</h3>
                      </div>
                      <span className="dashStatus">Libre</span>
                    </div>
                    <div className="dashMeta">
                      <p><strong>Siguiente paso</strong>Entra en partidos para crear uno nuevo o apuntarte a un encuentro abierto.</p>
                    </div>
                    <div className="dashBtns">
                      <Link className="dashBtn dashBtnMain" to="/matches">
                        Explorar partidos
                      </Link>
                    </div>
                  </article>
                )}
              </div>
            </section>

            <section className="dashSection">
              <article className="dashCard dashBox">
                <div className="dashHead">
                  <span className="dashTag">Actividad reciente</span>
                  <h2>Lo último en tu cuenta</h2>
                </div>

                <div className="dashList">
                  {recent.map((item) => (
                    <div className="dashItem" key={item.id}>
                      <div>
                        <strong className="dashItemTitle">{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <span className="dashTime">{item.time}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>

          <aside className="dashCol">
            <section className="dashCol">
              <article className="dashCard dashBox">
                <div className="dashTop">
                  <div>
                    <span className="dashTag">Acciones rápidas</span>
                    <h3 className="dashTitle">Muévete por tu zona</h3>
                  </div>
                </div>
                <p>El dashboard queda como resumen y la gestión principal vive en partidos y mis partidos.</p>

                <div className="dashCol">
                  <Link className="dashBtn dashBtnMain" to="/my-matches">
                    Ver mis partidos
                  </Link>
                  <Link className="dashBtn dashBtnAlt" to="/matches">
                    Crear o buscar partidos
                  </Link>
                  <a className="dashBtn dashBtnAlt" href="#perfil-resumen">
                    Ver perfil
                  </a>
                </div>
              </article>
            </section>

            <section id="perfil-resumen">
              <article className="dashCard dashBox">
                <span className="dashTag">Perfil resumido</span>
                <h2>Tu información actual</h2>

                <div className="dashCol">
                  <div className="dashInfo">
                    <strong>Username</strong>
                    <span>{summary.currentUser.username}</span>
                  </div>
                  <div className="dashInfo">
                    <strong>Email</strong>
                    <span>{summary.currentUser.email || "No disponible"}</span>
                  </div>
                  <div className="dashInfo">
                    <strong>Nombre</strong>
                    <span>{summary.currentUser.nombre || "No indicado"}</span>
                  </div>
                  <div className="dashInfo">
                    <strong>Rol</strong>
                    <span>{summary.currentUser.rol || "Jugador"}</span>
                  </div>
                </div>

                {message ? <p className="dashNote">{message}</p> : null}
              </article>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
};
