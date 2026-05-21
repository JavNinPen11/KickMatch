import { useState } from "react"
import { Nav } from "../components/nav/Nav"
import style from "./stylePages/reservePage.module.scss"

const reserveOptions = [
    {
        id: 1,
        name: "Pista Municipal Norte",
        location: "Polideportivo Municipal",
        price: 18,
        date: "2026-06-15",
        startTime: "18:00",
        endTime: "19:00",
        isAvailable: true,
    },
    {
        id: 2,
        name: "Pista San Vicente",
        location: "San Vicente",
        price: 15,
        date: "2026-06-16",
        startTime: "19:00",
        endTime: "20:00",
        isAvailable: true,
    },
    {
        id: 3,
        name: "Pista Elche Centro",
        location: "Elche",
        price: 20,
        date: "2026-06-17",
        startTime: "20:00",
        endTime: "21:00",
        isAvailable: false,
    },
]

export default function ReservePage() {
    const [selectedReserve, setSelectedReserve] = useState(null)
    const [reservations, setReservations] = useState([])
    const [message, setMessage] = useState("")

    const selectReserve = (reserve) => {
        if (!reserve.isAvailable) {
            setMessage("Esta pista no está disponible ahora mismo.")
            return
        }

        setSelectedReserve(reserve)
        setMessage("")
    }

    const confirmReservation = () => {
        if (!selectedReserve) {
            setMessage("Selecciona una pista antes de confirmar la reserva.")
            return
        }

        const newReservation = {
            id: Date.now(),
            name: selectedReserve.name,
            location: selectedReserve.location,
            price: selectedReserve.price,
            date: selectedReserve.date,
            startTime: selectedReserve.startTime,
            endTime: selectedReserve.endTime,
            status: "Confirmada",
            paymentType: "Efectivo",
        }

        setReservations((prev) => [...prev, newReservation])
        setSelectedReserve(null)
        setMessage("Reserva confirmada correctamente.")
    }

    const cancelReservation = (reservationId) => {
        setReservations((prev) =>
            prev.filter((reservation) => reservation.id !== reservationId)
        )

        setMessage("Reserva cancelada correctamente.")
    }

    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Reservas</span>

                    <h1>Reservar pista</h1>

                    <p className="textBase">
                        Selecciona una pista disponible, revisa el resumen y confirma tu
                        reserva. El pago se realiza en efectivo en la instalación.
                    </p>
                </section>

                {message ? <p className="message">{message}</p> : null}

                <section className={style.mainGrid}>
                    <div>
                        <div className={style.sectionTop}>
                            <h2>Pistas disponibles</h2>
                        </div>

                        <div className={style.cards}>
                            {reserveOptions.map((reserve) => (
                                <article className={`cardBase ${style.card}`} key={reserve.id}>
                                    <div className={style.cardTop}>
                                        <h3>{reserve.name}</h3>

                                        <span
                                            className={
                                                reserve.isAvailable
                                                    ? style.available
                                                    : style.notAvailable
                                            }
                                        >
                                            {reserve.isAvailable ? "Disponible" : "No disponible"}
                                        </span>
                                    </div>

                                    <div className={style.info}>
                                        <p>
                                            <strong>Ubicación:</strong> {reserve.location}
                                        </p>

                                        <p>
                                            <strong>Fecha:</strong> {reserve.date}
                                        </p>

                                        <p>
                                            <strong>Horario:</strong> {reserve.startTime} - {reserve.endTime}
                                        </p>

                                        <p>
                                            <strong>Precio:</strong> {reserve.price} €
                                        </p>
                                    </div>

                                    <button
                                        className="btnOne"
                                        type="button"
                                        onClick={() => selectReserve(reserve)}
                                        disabled={!reserve.isAvailable}
                                    >
                                        Reservar pista
                                    </button>
                                </article>
                            ))}
                        </div>
                    </div>

                    <aside className={`cardBase ${style.summary}`}>
                        <div className={style.sectionTop}>
                            <h2>Resumen</h2>
                            <p>Revisa la pista antes de confirmar.</p>
                        </div>

                        {selectedReserve ? (
                            <div className={style.detail}>
                                <h3>{selectedReserve.name}</h3>

                                <p>
                                    <strong>Ubicación:</strong> {selectedReserve.location}
                                </p>

                                <p>
                                    <strong>Fecha:</strong> {selectedReserve.date}
                                </p>

                                <p>
                                    <strong>Horario:</strong> {selectedReserve.startTime} - {selectedReserve.endTime}
                                </p>

                                <p>
                                    <strong>Precio:</strong> {selectedReserve.price} €
                                </p>

                                <p>
                                    <strong>Pago:</strong> En efectivo
                                </p>

                                <button
                                    className="btnOne"
                                    type="button"
                                    onClick={confirmReservation}
                                >
                                    Confirmar reserva
                                </button>
                            </div>
                        ) : (
                            <p className="textBase">
                                Todavía no has seleccionado ninguna pista.
                            </p>
                        )}
                    </aside>
                </section>

                <section className={`cardBase ${style.myReservations}`}>
                    <div className={style.sectionTop}>
                        <h2>Mis reservas</h2>
                        <p>Consulta o cancela las reservas creadas durante la sesión.</p>
                    </div>

                    <div className={style.tableBox}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Pista</th>
                                    <th>Ubicación</th>
                                    <th>Fecha</th>
                                    <th>Horario</th>
                                    <th>Pago</th>
                                    <th>Estado</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td>{reservation.name}</td>
                                            <td>{reservation.location}</td>
                                            <td>{reservation.date}</td>
                                            <td>{reservation.startTime} - {reservation.endTime}</td>
                                            <td>{reservation.paymentType}</td>
                                            <td>{reservation.status}</td>
                                            <td>
                                                <button
                                                    className={style.btnCancel}
                                                    type="button"
                                                    onClick={() => cancelReservation(reservation.id)}
                                                >
                                                    Cancelar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">Aún no tienes reservas.</td>
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