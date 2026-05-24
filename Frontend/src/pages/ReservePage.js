import { useEffect, useState } from "react"
import { Nav } from "../components/nav/Nav"
import style from "./stylePages/reservePage.module.scss"
import {
    getEscaparateRequest,
    getCategoriesRequest,
    getCarritoRequest,
    addToCarritoRequest,
    confirmarReservaRequest,
    eliminarLineaRequest,
    getMyReservasRequest,
    cancelarReservaRequest
} from "../api/reservaService"
import Loading from "../components/forms/Loading"

export default function ReservePage() {
    const [fields, setFields] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [carrito, setCarrito] = useState(null)
    const [reservas, setReservas] = useState([])
    const [selectedField, setSelectedField] = useState(null)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [bookingForm, setBookingForm] = useState({
        fecha: "", horaInicio: "", horaFin: ""
    })

    function formatReserveDate(dateValue) {
        if (!dateValue) {
            return "Sin fecha"
        }

        const date = new Date(dateValue)

        if (Number.isNaN(date.getTime())) {
            return "Sin fecha"
        }

        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    useEffect(() => {
        const load = async () => {
            try {
                const [fieldsData, categoriesData, carritoData, reservasData] = await Promise.all([
                    getEscaparateRequest(),
                    getCategoriesRequest(),
                    getCarritoRequest(),
                    getMyReservasRequest()
                ])
                setFields(fieldsData)
                setCategories(categoriesData)
                setCarrito(carritoData)
                setReservas(reservasData)
            } catch (error) {
                setMessage("No se pudieron cargar los datos.")
            } finally { setIsLoading(false) }
        }
        load()
    }, [])

    const handleCategoryFilter = async (categoryId) => {
        setSelectedCategory(categoryId)
        try {
            const data = await getEscaparateRequest(categoryId)
            setFields(data)
        } catch {
            setMessage("No se pudieron cargar los campos.")
        }
    }

    const selectField = (field) => {
        setSelectedField(field)
        setBookingForm({ fecha: "", horaInicio: "", horaFin: "" })
        setMessage("")
    }

    const handleAddToCarrito = async () => {
        if (!selectedField || !bookingForm.fecha || !bookingForm.horaInicio || !bookingForm.horaFin) {
            setMessage("Completa todos los campos antes de reservar.")
            return
        }

        try {
            await addToCarritoRequest({
                fieldId: selectedField.id,
                fecha: bookingForm.fecha,
                horaInicio: bookingForm.horaInicio,
                horaFin: bookingForm.horaFin,
                cantidad: 1
            })

            const carritoData = await getCarritoRequest()
            setCarrito(carritoData)
            setSelectedField(null)
            setMessage("Pista añadida al carrito correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo añadir al carrito.")
        }
    }

    const handleEliminarLinea = async (lineaId) => {
        try {
            await eliminarLineaRequest(lineaId)
            const carritoData = await getCarritoRequest()
            setCarrito(carritoData)
            setMessage("Línea eliminada correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo eliminar la línea.")
        }
    }

    const handleConfirmar = async () => {
        if (!carrito || carrito.lineas.length === 0) {
            setMessage("El carrito está vacío.")
            return
        }

        try {
            await confirmarReservaRequest()
            const reservasData = await getMyReservasRequest()
            setReservas(reservasData)
            setCarrito(null)
            setMessage("Reserva confirmada correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo confirmar la reserva.")
        }
    }

    const handleCancelarReserva = async (reservaId) => {
        try {
            await cancelarReservaRequest(reservaId)
            setReservas((prev) => prev.map((r) =>
                r.id === reservaId ? { ...r, estado: "cancelada" } : r
            ))
            setMessage("Reserva cancelada correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo cancelar la reserva.")
        }
    }

    if (isLoading) return <Loading />

    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Reservas</span>
                    <h1>Reservar pista</h1>
                    <p className="textBase">
                        Selecciona una pista disponible, revisa el resumen y confirma tu reserva.
                    </p>
                </section>

                {message ? <p className="message">{message}</p> : null}

                <div className={style.categories}>
                    <button className={`btnTwo ${!selectedCategory ? "btnOne" : ""}`}
                        type="button" onClick={() => handleCategoryFilter(null)}>
                        Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`btnTwo ${selectedCategory === cat.id ? "btnOne" : ""}`}
                            type="button"
                            onClick={() => handleCategoryFilter(cat.id)}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>

                <section className={style.mainGrid}>
                    <div>
                        <div className={style.sectionTop}>
                            <h2>Pistas disponibles</h2>
                        </div>

                        <div className={style.cards}>
                            {fields.length > 0 ? fields.map((field) => (
                                <article className={`cardBase ${style.card}`} key={field.id}>
                                    <div className={style.cardTop}>
                                        <h3>{field.nombre}</h3>
                                        <span className={style.available}>Disponible</span>
                                    </div>

                                    <div className={style.info}>
                                        <p><strong>Categoría:</strong> {field.category?.nombre}</p>
                                        <p><strong>Descripción:</strong> {field.descripcion}</p>
                                        <p><strong>Precio:</strong> {field.precio} €/h</p>
                                    </div>

                                    <button className="btnOne" type="button" onClick={() => selectField(field)}>
                                        Reservar pista
                                    </button>
                                </article>
                            )) : (
                                <p className="textBase">No hay pistas disponibles.</p>
                            )}
                        </div>
                    </div>

                    <aside className={`cardBase ${style.summary}`}>
                        <div className={style.sectionTop}>
                            <h2>Resumen</h2>
                            <p>Revisa la pista antes de confirmar.</p>
                        </div>

                        {selectedField ? (
                            <div className={style.detail}>
                                <h3>{selectedField.nombre}</h3>
                                <p><strong>Precio:</strong> {selectedField.precio} €/h</p>

                                <div className={style.formGroup}>
                                    <label>Fecha</label>
                                    <input className="inputBase" type="date"
                                        value={bookingForm.fecha}
                                        onChange={(e) => setBookingForm((p) => ({ ...p, fecha: e.target.value }))} />
                                </div>

                                <div className={style.formGroup}>
                                    <label>Hora inicio</label>
                                    <input className="inputBase" type="time"
                                        value={bookingForm.horaInicio}
                                        onChange={(e) => setBookingForm((p) => ({ ...p, horaInicio: e.target.value }))} />
                                </div>

                                <div className={style.formGroup}>
                                    <label>Hora fin</label>
                                    <input className="inputBase" type="time"
                                        value={bookingForm.horaFin}
                                        onChange={(e) => setBookingForm((p) => ({ ...p, horaFin: e.target.value }))} />
                                </div>

                                <button className="btnOne" type="button" onClick={handleAddToCarrito}>
                                    Añadir al carrito
                                </button>
                            </div>
                        ) : (
                            <p className="textBase">Selecciona una pista para reservar.</p>
                        )}

                        {carrito && carrito.lineas.length > 0 && (
                            <div className={style.carrito}>
                                <h3>Carrito</h3>
                                {carrito.lineas.map((linea) => (
                                    <div className={style.carritoLinea} key={linea.id}>
                                        <p><strong>{linea.field.nombre}</strong></p>
                                        <p>{formatReserveDate(linea.fecha)} · {linea.horaInicio} - {linea.horaFin}</p>
                                        <p>{linea.precio} €</p>
                                        <button className={style.btnCancel} type="button"
                                            onClick={() => handleEliminarLinea(linea.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <button className="btnOne" type="button" onClick={handleConfirmar}>
                                    Confirmar reserva
                                </button>
                            </div>
                        )}
                    </aside>
                </section>

                <section className={`cardBase ${style.myReservations}`}>
                    <div className={style.sectionTop}>
                        <h2>Mis reservas</h2>
                        <p>Consulta o cancela tus reservas.</p>
                    </div>

                    <div className={style.tableBox}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Pista</th>
                                    <th>Fecha</th>
                                    <th>Horario</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.length > 0 ? (
                                    reservas.map((reserva) => (
                                        reserva.lineas.map((linea) => (
                                            <tr key={linea.id}>
                                                <td>{linea.field.nombre}</td>
                                                <td>{formatReserveDate(linea.fecha)}</td>
                                                <td>{linea.horaInicio} - {linea.horaFin}</td>
                                                <td>{linea.precio} €</td>
                                                <td>{reserva.estado}</td>
                                                <td>
                                                    {reserva.estado !== "cancelada" && (
                                                        <button className={style.btnCancel} type="button"
                                                            onClick={() => handleCancelarReserva(reserva.id)}>
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">Aún no tienes reservas.</td>
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