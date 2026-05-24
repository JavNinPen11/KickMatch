import { useContext, useEffect, useState } from "react"
import { Nav } from "../components/nav/Nav"
import { AuthContext } from "../context/authContext"
import { getAdminMatchesRequest, getAdminUsersRequest, updateAdminUserRequest, deleteAdminUserRequest, cancelAdminMatchRequest, updateAdminMatchRequest, deleteAdminMatchRequest, createAdminUserRequest } from "../api/adminService"
import style from "./stylePages/panelAdmin.module.scss"

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

    const [users, setUsers] = useState([])
    const [matches, setMatches] = useState([])
    const [message, setMessage] = useState("")
    const [isLoadingMatches, setIsLoadingMatches] = useState(true)
    const [editUser, setEditUser] = useState(null)
    const [editForm, setEditForm] = useState({
        username: "", nombre: "", email: "", password: "", rolId: ""
    })
    const [deleteUser, setDeleteUser] = useState(null)
    const [editMatch, setEditMatch] = useState(null)
    const [editMatchForm, setEditMatchForm] = useState({
        date: "", time: "", location: "", maxPlayers: "", state: ""
    })
    const [deleteMatch, setDeleteMatch] = useState(null)
    const [showCreateUser, setShowCreateUser] = useState(false)
    const [createUserForm, setCreateUserForm] = useState({
        username: "", nombre: "", email: "", password: "", rolId: 2
    })

    const openEditUser = (user) => {
        setEditUser(user)
        setEditForm({
            username: user.username || "",
            nombre: user.nombre || "",
            email: user.email || "",
            password: "",
            rolId: user.rol?.nombre === "admin" ? 1 : 2,
        })
    }

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                setIsLoadingMatches(false)
                return
            }

            const token = localStorage.getItem("token")

            try {
                const data = await getAdminMatchesRequest()
                const usersData = await getAdminUsersRequest(token)
                setMatches(data)
                setUsers(usersData)
                setMessage("")
            }
            catch (error) {
                setMessage(error.message || "No se pudieron cargar los datos.")
            }
            finally {
                setIsLoadingMatches(false)
            }
        }

        loadData()
    }, [user])

    const openMatches = matches.filter((match) => match.state === "Abierto").length
    const cancelMatches = matches.filter((match) => match.state === "Cancelado").length

    const closeEditUser = () => setEditUser(null)

    const handleUpdateUser = async () => {
        const token = localStorage.getItem("token")
        try {
            await updateAdminUserRequest(token, editUser.id, editForm)
            setUsers((prev) => prev.map((u) =>
                u.id === editUser.id
                    ? { ...u, username: editForm.username, nombre: editForm.nombre, email: editForm.email, rol: { nombre: editForm.rolId === 1 ? "admin" : "usuario" } }
                    : u
            ))
            closeEditUser()
        } catch (error) {
            setMessage(error.message || "No se pudo actualizar el usuario.")
        }
    }
    const openDeleteUser = (user) => setDeleteUser(user)
    const closeDeleteUser = () => setDeleteUser(null)

    const handleDeleteUser = async () => {
        const token = localStorage.getItem("token")
        try {
            await deleteAdminUserRequest(token, deleteUser.id)
            setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id))
            closeDeleteUser()
        } catch (error) {
            setMessage(error.message || "No se pudo eliminar el usuario.")
        }
    }
    const openEditMatch = (match) => {
        setEditMatch(match)
        setEditMatchForm({
            date: match.date?.split("T")[0] || "",
            time: match.time?.includes("T")
                ? match.time.split("T")[1].slice(0, 5)
                : match.time || "",
            location: match.location || "",
            maxPlayers: match.maxPlayers || "",
            state: match.state || "",
        })
    }
    const closeEditMatch = () => setEditMatch(null)

    const handleUpdateMatch = async () => {
        const token = localStorage.getItem("token")
        try {
            await updateAdminMatchRequest(token, editMatch.id, editMatchForm)
            setMatches((prev) => prev.map((m) =>
                m.id === editMatch.id ? { ...m, ...editMatchForm } : m
            ))
            closeEditMatch()
        } catch (error) {
            setMessage(error.message || "No se pudo actualizar el partido.")
        }
    }

    const openDeleteMatch = (match) => setDeleteMatch(match)
    const closeDeleteMatch = () => setDeleteMatch(null)

    const handleDeleteMatch = async () => {
        const token = localStorage.getItem("token")
        try {
            await deleteAdminMatchRequest(token, deleteMatch.id)
            setMatches((prev) => prev.filter((m) => m.id !== deleteMatch.id))
            closeDeleteMatch()
        } catch (error) {
            setMessage(error.message || "No se pudo eliminar el partido.")
        }
    }

    const handleCancelMatch = async (matchId) => {
        const token = localStorage.getItem("token")
        try {
            await cancelAdminMatchRequest(token, matchId)
            setMatches((prev) => prev.map((m) =>
                m.id === matchId ? { ...m, state: "cancelado" } : m
            ))
        } catch (error) {
            setMessage(error.message || "No se pudo cancelar el partido.")
        }
    }
    const openCreateUser = () => setShowCreateUser(true)
    const closeCreateUser = () => {
        setShowCreateUser(false)
        setCreateUserForm({ username: "", nombre: "", email: "", password: "", rolId: 2 })
    }

    const handleCreateUser = async () => {
        const token = localStorage.getItem("token")
        try {
            const newUser = await createAdminUserRequest(token, createUserForm)
            setUsers((prev) => [...prev, {
                ...newUser,
                rol: { nombre: createUserForm.rolId === 1 ? "admin" : "usuario" }
            }])
            closeCreateUser()
        } catch (error) {
            setMessage(error.message || "No se pudo crear el usuario.")
        }
    }
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
                    <div className={style.sectionTop}>
                        <h2>Usuarios</h2>
                        <button className="btnOne" type="button" onClick={openCreateUser}>
                            Crear usuario
                        </button>
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
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.rol?.nombre || "Sin rol"}</td>
                                            <td>
                                                <div className={style.buttons}>
                                                    <button className={style.btnDelete} type="button" onClick={() => openDeleteUser(user)}>
                                                        Borrar
                                                    </button>
                                                    <button className={style.btnEdit} type="button" onClick={() => openEditUser(user)}>
                                                        Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No hay usuarios registrados todavía.</td>
                                    </tr>
                                )}
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
                                                    <button className={style.btnEdit} type="button" onClick={() => openEditMatch(match)}>
                                                        Editar
                                                    </button>
                                                    <button className={style.btnCancel} type="button" onClick={() => handleCancelMatch(match.id)}>
                                                        Cancelar
                                                    </button>
                                                    <button className={style.btnDelete} type="button" onClick={() => openDeleteMatch(match)}>
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
                {editUser && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={closeEditUser}>x</button>
                            <h2>Editar usuario</h2>

                            <div className={style.formGroup}>
                                <label>Username</label>
                                <input className="inputBase" value={editForm.username}
                                    onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Nombre</label>
                                <input className="inputBase" value={editForm.nombre}
                                    onChange={(e) => setEditForm((p) => ({ ...p, nombre: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Email</label>
                                <input className="inputBase" type="email" value={editForm.email}
                                    onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Contraseña (dejar vacío para no cambiar)</label>
                                <input className="inputBase" type="password" value={editForm.password}
                                    onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Rol</label>
                                <select className="inputBase" value={editForm.rolId}
                                    onChange={(e) => setEditForm((p) => ({ ...p, rolId: Number(e.target.value) }))}>
                                    <option value={2}>Jugador</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>

                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleUpdateUser}>
                                    Guardar cambios
                                </button>
                                <button className="btnTwo" type="button" onClick={closeEditUser}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {deleteUser && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={closeDeleteUser}>x</button>
                            <h2>Eliminar usuario</h2>
                            <p>¿Seguro que quieres eliminar a <strong>{deleteUser.username}</strong>? Esta acción no se puede deshacer.</p>
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleDeleteUser}>
                                    Confirmar
                                </button>
                                <button className="btnTwo" type="button" onClick={closeDeleteUser}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {editMatch && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={closeEditMatch}>x</button>
                            <h2>Editar partido</h2>

                            <div className={style.formGroup}>
                                <label>Fecha</label>
                                <input className="inputBase" type="date" value={editMatchForm.date}
                                    onChange={(e) => setEditMatchForm((p) => ({ ...p, date: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Hora</label>
                                <input className="inputBase" type="time" value={editMatchForm.time}
                                    onChange={(e) => setEditMatchForm((p) => ({ ...p, time: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Ubicación</label>
                                <input className="inputBase" type="text" value={editMatchForm.location}
                                    onChange={(e) => setEditMatchForm((p) => ({ ...p, location: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Máximo de jugadores</label>
                                <input className="inputBase" type="number" min="2" max="20" value={editMatchForm.maxPlayers}
                                    onChange={(e) => setEditMatchForm((p) => ({ ...p, maxPlayers: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Estado</label>
                                <select className="inputBase" value={editMatchForm.state}
                                    onChange={(e) => setEditMatchForm((p) => ({ ...p, state: e.target.value }))}>
                                    <option value="abierto">Abierto</option>
                                    <option value="completo">Completo</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </div>

                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleUpdateMatch}>Guardar</button>
                                <button className="btnTwo" type="button" onClick={closeEditMatch}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteMatch && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={closeDeleteMatch}>x</button>
                            <h2>Eliminar partido</h2>
                            <p>¿Seguro que quieres eliminar el partido en <strong>{deleteMatch.location}</strong>? Esta acción no se puede deshacer.</p>
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleDeleteMatch}>Confirmar</button>
                                <button className="btnTwo" type="button" onClick={closeDeleteMatch}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
                {showCreateUser && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={closeCreateUser}>x</button>
                            <h2>Crear usuario</h2>

                            <div className={style.formGroup}>
                                <label>Username</label>
                                <input className="inputBase" value={createUserForm.username}
                                    onChange={(e) => setCreateUserForm((p) => ({ ...p, username: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Nombre</label>
                                <input className="inputBase" value={createUserForm.nombre}
                                    onChange={(e) => setCreateUserForm((p) => ({ ...p, nombre: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Email</label>
                                <input className="inputBase" type="email" value={createUserForm.email}
                                    onChange={(e) => setCreateUserForm((p) => ({ ...p, email: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Contraseña</label>
                                <input className="inputBase" type="password" value={createUserForm.password}
                                    onChange={(e) => setCreateUserForm((p) => ({ ...p, password: e.target.value }))} />
                            </div>

                            <div className={style.formGroup}>
                                <label>Rol</label>
                                <select className="inputBase" value={createUserForm.rolId}
                                    onChange={(e) => setCreateUserForm((p) => ({ ...p, rolId: Number(e.target.value) }))}>
                                    <option value={2}>Jugador</option>
                                    <option value={1}>Admin</option>
                                </select>
                            </div>

                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleCreateUser}>Crear</button>
                                <button className="btnTwo" type="button" onClick={closeCreateUser}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}