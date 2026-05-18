import { useState } from "react"
import {
    getMaxMatchDateString,
    getTodayDateString,
    isValidMatchDate,
} from "../../api/matchUtils.js"
import "./CreateMatchForm.scss"

const emptyForm = {
    fecha: "",
    hora: "",
    ubicacion: "",
    maxJugadores: "",
    duracion: "",
}

export function CreateMatchForm({ onCreate }) {
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState("")

    const minDate = getTodayDateString()
    const maxDate = getMaxMatchDateString()

    function changeInput(e) {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: value,
        })

        setError("")
    }

    function sendForm(e) {
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

        onCreate({
            ...form,
            maxJugadores,
            duracion,
        })

        setForm(emptyForm)
        setError("")
    }

    return (
        <form className="matchForm" onSubmit={sendForm}>
            <p>Crear partido</p>

            <div className="formGroup">
                <input
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={changeInput}
                    min={minDate}
                    max={maxDate}
                    required/>
            </div>

            <div className="formGroup">
                <input
                    name="hora"
                    type="time"
                    value={form.hora}
                    onChange={changeInput}
                    required
                />
            </div>

            <div className="formGroup">
                <input
                    name="ubicacion"
                    type="text"
                    placeholder="Ubicación"
                    value={form.ubicacion}
                    onChange={changeInput}
                    required
                />
            </div>

            <div className="formGroup">
                <input
                    name="maxJugadores"
                    type="number"
                    placeholder="Máximo de jugadores"
                    min="2"
                    max="20"
                    value={form.maxJugadores}
                    onChange={changeInput}
                    required
                />
            </div>

            <div className="formGroup">
                <input
                    name="duracion"
                    type="number"
                    placeholder="Duración en minutos"
                    min="1"
                    max="90"
                    value={form.duracion}
                    onChange={changeInput}
                />
            </div>

            {error ? <p className="formError">{error}</p> : null}

            <button className="btnSave" type="submit">
                Guardar partido
            </button>
        </form>
    )
}