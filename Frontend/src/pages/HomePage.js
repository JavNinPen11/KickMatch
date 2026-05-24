import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Nav } from "../components/nav/Nav"
import { AuthContext } from "../context/authContext"
import style from "./stylePages/homePage.module.scss"
import { allMatches } from "../api/matchService"
import { normalizeMatch } from "../api/matchUtils"
import { formatDate, formatState } from "../utils/formatUtils"
import { getEscaparateRequest } from "../api/reservaService"
import Loading from "../components/forms/Loading"

const howWorks = [
    {
        title: "Busca un partido",
        description: "Consulta los encuentros abiertos y revisa la fecha, la hora y las plazas disponibles.",
    },
    {
        title: "Apúntate o crea el tuyo",
        description: "Únete a una pachanga cercana o prepara un partido nuevo en pocos pasos.",
    },
    {
        title: "Reserva una pista",
        description: "Elige una pista disponible, selecciona fecha y horario, y confirma tu reserva.",
    },
    {
        title: "Organiza y juega",
        description: "Ten toda la información del partido clara para que solo quede reunirse y jugar.",
    },
]

export default function HomePage() {
    const { user } = useContext(AuthContext)
    const isLogin = Boolean(user)

    const [matches, setMatches] = useState([])
    const [isLoadingMatches, setIsLoadingMatches] = useState(true)
    const [matchesMessage, setMatchesMessage] = useState("")
    const [fields, setFields] = useState([])
    const [fieldPage, setFieldPage] = useState(0)
    const [matchPage, setMatchPage] = useState(0)

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const response = await allMatches()
                const data = Array.isArray(response?.matches) ? response.matches : []
                setMatches(data.map(normalizeMatch))
                setMatchesMessage("")
            } catch (error) {
                setMatches([])
                setMatchesMessage("No se pudieron cargar los partidos.")
            } finally {
                setIsLoadingMatches(false)
            }
        }
        loadMatches()
    }, [])

    useEffect(() => {
        const loadFields = async () => {
            try {
                const data = await getEscaparateRequest()
                setFields(Array.isArray(data) ? data : [])
            } catch {
                setFields([])
            }
        }
        loadFields()
    }, [])

    const fieldsPerPage = 3
    const matchesPerPage = 3

    const visibleFields = fields.length > fieldsPerPage
        ? [...fields, ...fields.slice(0, fieldsPerPage)].slice(fieldPage, fieldPage + fieldsPerPage)
        : fields

    const visibleMatches = matches.length > matchesPerPage
        ? [...matches, ...matches.slice(0, matchesPerPage)].slice(matchPage, matchPage + matchesPerPage)
        : matches

    const goPrevFields = () => setFieldPage((prev) => prev === 0 ? Math.max(fields.length - 1, 0) : prev - 1)
    const goNextFields = () => setFieldPage((prev) => prev >= fields.length - 1 ? 0 : prev + 1)
    const goPrevMatches = () => setMatchPage((prev) => prev === 0 ? Math.max(matches.length - 1, 0) : prev - 1)
    const goNextMatches = () => setMatchPage((prev) => prev >= matches.length - 1 ? 0 : prev + 1)

    useEffect(() => {
        if (fields.length <= fieldsPerPage) return
        const interval = setInterval(() => {
            setFieldPage((prev) => prev >= fields.length - 1 ? 0 : prev + 1)
        }, 3500)
        return () => clearInterval(interval)
    }, [fields.length])

    useEffect(() => {
        if (matches.length <= matchesPerPage) return
        const interval = setInterval(() => {
            setMatchPage((prev) => prev >= matches.length - 1 ? 0 : prev + 1)
        }, 3500)
        return () => clearInterval(interval)
    }, [matches.length])

    if (isLoadingMatches) return <Loading />

    return (
        <main className="mainPage">
            <Nav variant="landing" />

            <div className="content">
                <section className={style.hero}>
                    <div className={`cardBase ${style.heroBox}`}>
                        <span className="labelYellow">KickMatch</span>
                        <h1 className="titleLarge">Encuentra tu próximo partido de fútbol</h1>
                        <p className="textBase">
                            Crea partidos, apúntate a encuentros cerca de ti y conoce gente facilmente
                        </p>
                        <div className={style.heroBtns}>
                            <Link className="btnOne" to="/matches">Ver partidos</Link>
                            {isLogin ? (
                                <Link className="btnTwo" to="/dashboard#proximos-partidos">Ver mis partidos</Link>
                            ) : (
                                <Link className="btnTwo" to="/register">Crear cuenta</Link>
                            )}
                        </div>
                    </div>
                </section>

                <section className={style.section} id="partidos-recientes">
                    <div className={style.sectionTop}>
                        <h2 className="title">Partidos más recientes</h2>
                    </div>

                    <div className={style.carouselBox}>
                        <div className={style.carouselContent}>
                            <div className={style.carouselGrid} key={matchPage}>
                                {visibleMatches.length > 0 ? (
                                    visibleMatches.map((match) => (
                                        <article className={`cardBase ${style.matchCard}`} key={match.id}>
                                            <h3 className={style.cardTitle}>
                                                {match.nombre || `Partido el ${formatDate(match.fecha)}`}
                                            </h3>
                                            <p><strong>Fecha:</strong> {formatDate(match.fecha)}</p>
                                            <p><strong>Hora:</strong> {match.hora}</p>
                                            <p><strong>Ubicación:</strong> {match.ubicacion}</p>
                                            <p><strong>Estado:</strong> {formatState(match.estado)}</p>
                                        </article>
                                    ))
                                ) : (
                                    <p className="textBase">{matchesMessage || "Todavía no hay partidos disponibles."}</p>
                                )}
                            </div>
                        </div>

                        {matches.length > matchesPerPage ? (
                            <div className={style.carouselActions}>
                                <button className={style.btnArrow} type="button" onClick={goPrevMatches}>{"<"}</button>
                                <span>{matchPage + 1} / {matches.length}</span>
                                <button className={style.btnArrow} type="button" onClick={goNextMatches}>{">"}</button>
                            </div>
                        ) : null}
                    </div>

                    <Link className={`btnOne ${style.sectionButton}`} to="/matches">Ver todos los partidos</Link>
                </section>

                <section className={style.section}>
                    <div className={style.sectionTop}>
                        <h2 className="title">Campos de fútbol disponibles</h2>
                    </div>

                    <div className={style.carouselBox}>
                        <div className={style.carouselContent}>
                            <div className={style.carouselGrid} key={fieldPage}>
                                {visibleFields.length > 0 ? (
                                    visibleFields.map((field) => (
                                        <article className={`cardBase ${style.matchCard}`} key={field.id}>
                                            <h3 className={style.cardTitle}>{field.nombre}</h3>
                                            <p><strong>Categoría:</strong> {field.category?.nombre || "Sin categoría"}</p>
                                            <p><strong>Descripción:</strong> {field.descripcion || "Sin descripción"}</p>
                                            <p><strong>Precio:</strong> {field.precio} €/h</p>
                                        </article>
                                    ))
                                ) : (
                                    <p className="textBase">No hay campos de fútbol disponibles ahora mismo.</p>
                                )}
                            </div>
                        </div>

                        {fields.length > fieldsPerPage ? (
                            <div className={style.carouselActions}>
                                <button className={style.btnArrow} type="button" onClick={goPrevFields}>{"<"}</button>
                                <span>{fieldPage + 1} / {fields.length}</span>
                                <button className={style.btnArrow} type="button" onClick={goNextFields}>{">"}</button>
                            </div>
                        ) : null}
                    </div>

                    <Link className={`btnOne ${style.sectionButton}`} to="/reservas">Ver reservas</Link>
                </section>

                <section className={style.section}>
                    <div className={style.sectionTop}>
                        <h2 className="title">Organiza tus partidos de fútbol sin complicarte</h2>
                    </div>
                    <div className={style.steps}>
                        {howWorks.map((item, index) => (
                            <article className={`cardBase ${style.stepCard}`} key={item.title}>
                                <span className={style.stepNumber}>0{index + 1}</span>
                                <h3 className={style.cardTitle}>{item.title}</h3>
                                <p className="textBase">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={`cardBase ${style.cta}`}>
                    <div className={style.ctaContent}>
                        <h2 className="title">¿Listo para jugar?</h2>
                        <p className="textBase">
                            {isLogin
                                ? "Revisa los partidos abiertos para unirte a tu próximo partido de fútbol o crea el tuyo propio. O busca entre nuestros campos de fútbol para reservarlo."
                                : "Regístrate y empieza a unirte o crear partidos de fútbol cerca de ti."}
                        </p>
                        <div className={style.heroBtns}>
                            {isLogin ? (
                                <Link className="btnOne" to="/matches">Ir a partidos</Link>
                            ) : (
                                <Link className="btnOne" to="/register">Registrarme</Link>
                            )}
                            <Link className="btnTwo" to="/reservas">Ir a Reservas</Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}