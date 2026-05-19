import { useContext, useEffect, useState } from "react"
import { Nav } from "../components/nav/nav"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import { getMeRequest, updateMeRequest, deleteMeRequest } from "../api/userService"
import style from "./stylePages/profilePage.module.scss"

export default function ProfilePage() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        username: "",
        nombre: "",
        email: "",
        rol: "",
    })

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [deleteText, setDeleteText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.token) {
                setIsLoading(false)
                return
            }

            try {
                const res = await getMeRequest(user.token)
                const data = res?.data || {}

                setForm({
                    username: data.username || "",
                    nombre: data.nombre || "",
                    email: data.email || "",
                    rol: data.rol || "Jugador",
                })

                setMessage("")
            } catch (error) {
                setMessage("No se pudieron cargar tus datos.")
            } finally {
                setIsLoading(false)
            }
        }

        loadProfile()
    }, [user])

    const changeInput = (event) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const saveProfile = async (event) => {
        event.preventDefault()

        if (!user?.token) {
            setMessage("No hay sesión activa.")
            return
        }

        setIsSaving(true)
        setMessage("")

        try {
            const payload = {
                username: form.username,
                nombre: form.nombre,
                email: form.email,
            }

            const res = await updateMeRequest(user.token, payload)
            const data = res?.data || {}

            setForm({
                username: data.username || "",
                nombre: data.nombre || "",
                email: data.email || "",
                rol: data.rol || "Jugador",
            })

            setMessage("Datos actualizados correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudieron guardar los cambios.")
        } finally {
            setIsSaving(false)
        }
    }

    const deleteAccount = async () => {
        if (!user?.token) {
            setMessage("No hay sesión activa.")
            return
        }

        if (deleteText !== "ELIMINAR") {
            setMessage("Para eliminar tu cuenta escribe ELIMINAR.")
            return
        }

        setIsDeleting(true)
        setMessage("")

        try {
            await deleteMeRequest(user.token)
            logout()
            navigate("/register")
        } catch (error) {
            setMessage(error.message || "No se pudo eliminar la cuenta.")
        } finally {
            setIsDeleting(false)
        }
    }
    const openDeleteModal = () => {
        setDeleteText("")
        setMessage("")
        setShowDeleteModal(true)
    }

    const closeDeleteModal = () => {
        if (isDeleting) {
            return
        }

        setDeleteText("")
        setShowDeleteModal(false)
    }

    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className="cardBase">
                    <div className={style.top}>
                        <span className="labelYellow">Perfil</span>
                        <h1>Tus datos</h1>
                        <p>
                            Aquí puedes consultar y editar la información básica de tu cuenta.
                        </p>
                    </div>

                    {isLoading ? (
                        <p className="textBase">Cargando datos...</p>
                    ) : (
                        <form className={style.form} onSubmit={saveProfile}>
                            <div className={style.formRow}>
                                <div className={style.formItem}>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        className="inputBase"
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={form.username}
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className={style.formItem}>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        className="inputBase"
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={form.nombre}
                                        onChange={changeInput}
                                    />
                                </div>
                            </div>

                            <div className={style.formRow}>
                                <div className={style.formItem}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        className="inputBase"
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={changeInput}
                                    />
                                </div>

                                <div className={style.formItem}>
                                    <label htmlFor="rol">Rol</label>
                                    <input
                                        className="inputBase"
                                        id="rol"
                                        name="rol"
                                        type="text"
                                        value={form.rol}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {message ? <p className="message">{message}</p> : null}

                            <div className="groupBtns">
                                <button className="btnOne" type="submit" disabled={isSaving}>
                                    {isSaving ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                            <div className={style.deleteArea}>
                                <button
                                    className={style.openDeleteBtn}
                                    type="button"
                                    onClick={openDeleteModal}
                                >
                                    Eliminar cuenta
                                </button>
                            </div>

                        </form>
                    )}
                </section>
            </div>
        </main>
    )
}