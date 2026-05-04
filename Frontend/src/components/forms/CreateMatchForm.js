import { useState } from "react";
import {
    getMaxMatchDateString,
    getTodayDateString,
    isValidMatchDate,
} from "../../api/matchUtils";
import "./CreateMatchForm.css"

const initialForm = {
    fecha: "",
    hora: "",
    ubicacion: "",
    maxJugadores: "",
    duracion: "",
}

export function CreateMatchForm({ onCreateMatch }) {
    const [form, setForm] = useState(initialForm)
    const [error, setError] = useState("")
    const minDate = getTodayDateString()
    const maxDate = getMaxMatchDateString()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (error) {
            setError("")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const maxJugadores = Number(form.maxJugadores)
        const duracion = form.duracion ? Number(form.duracion) : null

        if (!isValidMatchDate(form.fecha)) {
            setError("La fecha debe estar entre hoy y un máximo de 6 meses.")
            return
        }

        if (maxJugadores > 20) {
            setError("El máximo de jugadores no puede superar 20.")
            return
        }

        if (duracion && duracion > 90) {
            setError("La duración no puede superar 90 minutos.")
            return
        }

        onCreateMatch({
            ...form,
            maxJugadores,
            duracion,
        })
        setForm(initialForm)
        setError("")
    }

    return (
        <form className="CreateMatchForm" onSubmit={handleSubmit}>
            <p>Crear partido</p>
            <div className="form-group">
                <input
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChange}
                    min={minDate}
                    max={maxDate}
                    required/>
            </div>
            <div className="form-group">
                <input
                    name="hora"
                    type="time"
                    value={form.hora}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    name="ubicacion"
                    type="text"
                    placeholder="Ubicación"
                    value={form.ubicacion}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    name="maxJugadores"
                    type="number"
                    placeholder="Máximo de jugadores"
                    min="2"
                    max="20"
                    value={form.maxJugadores}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    name="duracion"
                    type="number"
                    placeholder="Duración del partido en min"
                    min="1"
                    max="90"
                    value={form.duracion}
                    onChange={handleChange}
                />
            </div>
            {error ? <p className="formError">{error}</p> : null}
            <button className="submit" type="submit">Guardar partido</button>
        </form>
    )
}
