import { useContext } from "react"
import { Link } from "react-router-dom"
import { Nav } from "../components/nav/nav"
import { AuthContext } from "../context/authContext"
import style from "./css/homePage.module.scss"

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
]

export default function HomePage() {
    const { user } = useContext(AuthContext)
    const isLogin = Boolean(user)

    return (
        <main className="mainPage">
            <Nav variant="landing" />

            <div className="content">
                <section className={style.hero}>
                    <div className={`cardBase ${style.heroBox}`}>
                        <span className="labelYellow">KickMatch</span>

                        <h1 className={style.heroTitle}>
                            Encuentra tu próximo partido de fútbol
                        </h1>

                        <p className="textBase">
                            Crea partidos, apúntate a encuentros cerca de ti y conoce gente,
                            o organiza tus pachangas fácilmente.
                        </p>

                        <div className={style.heroBtns}>
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

                <section className={style.section} id="partidos-recientes">
                    <div className={style.sectionTop}>
                        <h2 className={style.sectionTitle}>Partidos más recientes</h2>

                        <p className="textBase">
                            Consulta los últimos partidos subidos.
                        </p>
                    </div>

                    {/* Card de partidos pendiente de conectar con backend */}
                </section>

                <section className={style.section}>
                    <div className={style.sectionTop}>
                        <h2 className={style.sectionTitle}>
                            Organiza tus pachangas sin complicarte
                        </h2>
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
                        <h2 className={style.sectionTitle}>¿Listo para jugar?</h2>

                        <p className="textBase">
                            {isLogin
                                ? "Entra en tu panel o revisa los partidos abiertos para organizar tu siguiente pachanga."
                                : "Regístrate y empieza a unirte o crear partidos de fútbol cerca de ti."}
                        </p>

                        <div className={style.heroBtns}>
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
    )
}