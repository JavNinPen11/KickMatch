import { useState } from "react"
import { Nav } from "../components/nav/Nav"
import style from "./stylePages/fieldsPage.module.scss"

const fields = [
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

export default function FieldsPage() {
    const [selectedField, setSelectedField] = useState(null)
    const [reservations, setReservations] = useState([])
    const [message, setMessage] = useState("")

    const selectField = (field) => {
        if (!field.isAvailable) {
            setMessage("Esta pista no está disponible ahora mismo.")
            return
        }

        setSelectedField(field)
        setMessage("")
    }

    const confirmReservation = () => {
        if (!selectedField) {
            setMessage("Selecciona una pista antes de confirmar la reserva.")
            return
        }

        const newReservation = {
            id: Date.now(),
            fieldName: selectedField.name,
            location: selectedField.location,
            price: selectedField.price,
            date: selectedField.date,
            startTime: selectedField.startTime,
            endTime: selectedField.endTime,
            status: "Confirmada",
            paymentType: "Efectivo",
        }

        setReservations((prev) => [...prev, newReservation])
        setSelectedField(null)
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

                    <h1>Reservar pista de fútbol</h1>

                    <p className="textBase">
                        Selecciona una pista de fútbol disponible, revisa el resumen y confirma tu
                        reserva. El pago se realiza en efectivo en la instalación.
                    </p>
                </section>

                {message ? <p className="message">{message}</p> : null}

                <section className={style.mainGrid}>
                    <div>

                        <div className={style.cards}>
                            {fields.map((field) => (
                                <article className={`cardBase ${style.card}`} key={field.id}>
                                    <div className={style.cardTop}>
                                        <h3>{field.name}</h3>

                                        <span
                                            className={
                                                field.isAvailable
                                                    ? style.available
                                                    : style.notAvailable
                                            }
                                        >
                                            {field.isAvailable ? "Disponible" : "No disponible"}
                                        </span>
                                    </div>

                                    <div className={style.info}>
                                        <p>
                                            <strong>Ubicación:</strong> {field.location}
                                        </p>

                                        <p>
                                            <strong>Fecha:</strong> {field.date}
                                        </p>

                                        <p>
                                            <strong>Horario:</strong> {field.startTime} - {field.endTime}
                                        </p>

                                        <p>
                                            <strong>Precio:</strong> {field.price} €
                                        </p>
                                    </div>

                                    <button
                                        className="btnOne"
                                        type="button"
                                        onClick={() => selectField(field)}
                                        disabled={!field.isAvailable}
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

                        {selectedField ? (
                            <div className={style.detail}>
                                <h3>{selectedField.name}</h3>

                                <p>
                                    <strong>Ubicación:</strong> {selectedField.location}
                                </p>

                                <p>
                                    <strong>Fecha:</strong> {selectedField.date}
                                </p>

                                <p>
                                    <strong>Horario:</strong> {selectedField.startTime} - {selectedField.endTime}
                                </p>

                                <p>
                                    <strong>Precio:</strong> {selectedField.price} €
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
                                            <td>{reservation.fieldName}</td>
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