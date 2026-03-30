import { useState } from "react";
import "./CreateMatchForm.css"

const initialForm = {
    fecha: "",
    hora: "",
    ubicacion: "",
    maxJugadores: ""
}

export function CreateMatchForm({ onCreateMatch }) {
    const [form, setForm] = useState(initialForm)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onCreateMatch({
            ...form,
            maxJugadores: Number(form.maxJugadores),
        })
        setForm(initialForm)
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
                    required
                />
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
                    value={form.maxJugadores}
                    onChange={handleChange}
                    required
                />
            </div>
            <button className="submit" type="submit">Guardar partido</button>
        </form>
    )
}
