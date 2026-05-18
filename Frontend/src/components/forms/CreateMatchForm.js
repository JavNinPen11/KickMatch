import { useState } from "react"
import {
    getMaxMatchDateString,
    getTodayDateString,
    isValidMatchDate,
} from "../../api/matchService"
import style from "./styleForms/createMatchForm.module.scss"

const emptyForm = {
    fecha: "",
    hora: "",
    ubicacion: "",
    maxJugadores: "",
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

    function handleSubmitSendForm(e) {
        e.preventDefault()

        const maxJugadores = Number(form.maxJugadores)

        if (!isValidMatchDate(form.fecha)) {
            setError("La fecha debe estar entre hoy y un máximo de 6 meses.")
            return
        }

        if (maxJugadores > 20) {
            setError("El máximo de jugadores no puede superar 20.")
            return
        }


        onCreate({
            ...form,
            maxJugadores,
        })

        setForm(emptyForm)
        setError("")
    }

    return (
        <form className="{style.matchForm}" onSubmit={handleSubmitSendForm}>
            <p>Crear partido</p>

  <div className={style.formGroup}>
                <input
                    className="inputBase"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={changeInput}
                    min={minDate}
                    max={maxDate}
                    required/>
            </div>

            <div className={style.formGroup}>
                <input
                    className="inputBase"
                    name="hora"
                    type="time"
                    value={form.hora}
                    onChange={changeInput}
                    required
                />
            </div>

            <div className={style.formGroup}>
                <input
                    className="inputBase"
                    name="ubicacion"
                    type="text"
                    placeholder="Ubicación"
                    value={form.ubicacion}
                    onChange={changeInput}
                    required
                />
            </div>

            <div className={style.formGroup}>
                <input
                    className="inputBase"
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

            {error ? <p className="error">{error}</p> : null}

            <button className={`btnOne ${style.btnSave}`} type="submit">
                Guardar partido
            </button>
        </form>
    )
}