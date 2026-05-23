import { useContext, useEffect, useState } from "react"
import { Nav } from "../components/nav/Nav"
import { AuthContext } from "../context/authContext"
import { getAdminMatchesRequest } from "../api/adminService"
import style from "./stylePages/panelAdmin.module.scss"
import { formatDate, formatTime, formatState } from "../utils/formatUtils"

function formatAdminDate(dateValue) {
    if (!dateValue) {
        return "Sin fecha"
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
        return "Sin fecha"
    }

    return date.toLocaleDateString("es-ES")
}

function formatAdminTime(timeValue) {
    if (!timeValue) {
        return "Sin hora"
    }

    if (typeof timeValue === "string" && timeValue.includes("T")) {
        return timeValue.split("T")[1].slice(0, 5)
    }

    return timeValue
}

export default function PanelAdmin() {
    const { user } = useContext(AuthContext)

    const [users] = useState([])
    const [matches, setMatches] = useState([])
    const [message, setMessage] = useState("")
    const [isLoadingMatches, setIsLoadingMatches] = useState(true)

    useEffect(() => {
        const loadMatches = async () => {
            console.log(user);
            console.log(user.token);
            
            
            if (!user) {
                setIsLoadingMatches(false)
                return
            }

            try {
                const data = await getAdminMatchesRequest()
                setMatches(data)
                setMessage("")
            } 
            catch (error) {
                setMessage(error.message || "No se pudieron cargar los partidos.")
            } 
            finally {
                setIsLoadingMatches(false)
            }
        }

        loadMatches()
    }, [user])

    const openMatches = matches.filter((match) => match.state === "Abierto").length
    const cancelMatches = matches.filter((match) => match.state === "Cancelado").length

    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Administrador</span>

                    <h1>Panel de administración</h1>

                    <p className="textBase">
                        Desde esta página se puede consultar un resumen general de KickMatch
                        y gestionar usuarios y partidos.
                    </p>
                </section>

                <section className={style.summary}>
                    <article className={`cardBase ${style.summaryCard}`}>
                        <span>Usuarios</span>
                        <strong>{users.length}</strong>
                    </article>

                    <article className={`cardBase ${style.summaryCard}`}>
                        <span>Partidos</span>
                        <strong>{matches.length}</strong>
                    </article>

                    <article className={`cardBase ${style.summaryCard}`}>
                        <span>Abiertos</span>
                        <strong>{openMatches}</strong>
                    </article>

                    <article className={`cardBase ${style.summaryCard}`}>
                        <span>Cancelados</span>
                        <strong>{cancelMatches}</strong>
                    </article>
                </section>

                {message ? <p className="message">{message}</p> : null}

                <section className={`cardBase ${style.users}`}>
                    <div className={style.sectionTop}>
                        <h2>Usuarios</h2>

                        <p>
                            Listado básico de usuarios registrados.
                        </p>
                    </div>

                    <div className={style.tableBox}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td colSpan="4">
                                        No hay usuarios conectados todavía.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className={`cardBase ${style.matches}`}>
                    <div className={style.sectionTop}>
                        <h2>Partidos</h2>

                        <p>
                            Listado básico de partidos creados en la plataforma.
                        </p>
                    </div>

                    <div className={style.tableBox}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Ubicación</th>
                                    <th>Creador</th>
                                    <th>Estado</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {matches.length > 0 ? (
                                    matches.map((match) => (
                                        <tr key={match.id}><td>{formatAdminDate(match.date)}</td>
                                            <td>{formatAdminTime(match.time)}</td>
                                            <td>{match.location}</td>
                                            <td>{match.creator?.username || "Sin creador"}</td>
                                            <td>{match.state}</td>
                                            <td>
                                                <div className={style.buttons}>
                                                    <button className={style.btnEdit} type="button">
                                                        Editar
                                                    </button>

                                                    <button className={style.btnCancel} type="button">
                                                        Cancelar
                                                    </button>

                                                    <button className={style.btnDelete} type="button">
                                                        Borrar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            {isLoadingMatches
                                                ? "Cargando partidos..."
                                                : "No hay partidos creados todavía."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    )
}