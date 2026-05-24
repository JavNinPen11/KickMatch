import { useState } from "react"
import { Nav } from "../components/nav/Nav"
import style from "./stylePages/contactPage.module.scss"

export default function ContactPage() {
    const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" })
    const [sent, setSent] = useState(false)

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
        setForm({ nombre: "", email: "", mensaje: "" })
    }

    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Contacto</span>
                    <h1>¿Tienes alguna pregunta?</h1>
                    <p className="textBase">
                        Estamos aquí para ayudarte. Rellena el formulario y te responderemos lo antes posible.
                    </p>
                </section>

                <section className={style.grid}>
                    <div className={`cardBase ${style.formCard}`}>
                        {sent ? (
                            <div className={style.success}>
                                <span className={style.successIcon}>✓</span>
                                <h2>Mensaje enviado</h2>
                                <p className="textBase">Gracias por contactarnos. Te responderemos en breve.</p>
                                <button className="btnOne" type="button" onClick={() => setSent(false)}>
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2>Escríbenos</h2>
                                <form className={style.form} onSubmit={handleSubmit}>
                                    <div className={style.formGroup}>
                                        <label>Nombre</label>
                                        <input
                                            className="inputBase"
                                            type="text"
                                            name="nombre"
                                            value={form.nombre}
                                            onChange={handleChange}
                                            placeholder="Tu nombre"
                                            required
                                        />
                                    </div>

                                    <div className={style.formGroup}>
                                        <label>Email</label>
                                        <input
                                            className="inputBase"
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>

                                    <div className={style.formGroup}>
                                        <label>Mensaje</label>
                                        <textarea
                                            className={`inputBase ${style.textarea}`}
                                            name="mensaje"
                                            value={form.mensaje}
                                            onChange={handleChange}
                                            placeholder="¿En qué podemos ayudarte?"
                                            required
                                        />
                                    </div>

                                    <button className="btnOne" type="submit">
                                        Enviar mensaje
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    <div className={style.info}>
                        <article className={`cardBase ${style.infoCard}`}>
                            <h3>Email</h3>
                            <p className="textBase">kickmatch.app@gmail.com</p>
                        </article>

                        <article className={`cardBase ${style.infoCard}`}>
                            <h3>Desarrolladores</h3>
                            <p className="textBase">Javier Santiago Niño Peñaloza</p>
                            <p className="textBase">Paula Escribano Reina</p>
                        </article>

                        <article className={`cardBase ${style.infoCard}`}>
                            <h3>Proyecto</h3>
                            <p className="textBase">Proyecto Final DAW — IES Mare Nostrum</p>
                        </article>
                    </div>
                </section>
            </div>
        </main>
    )
}