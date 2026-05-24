import { useEffect, useState } from "react"
import { Nav } from "../components/nav/Nav"
import {
    getAdminFieldsRequest,
    createAdminFieldRequest,
    updateAdminFieldRequest,
    toggleAdminFieldRequest,
    deleteAdminFieldRequest,
    getAdminCategoriesRequest,
    createAdminCategoryRequest,
    updateAdminCategoryRequest,
    deleteAdminCategoryRequest
} from "../api/adminService"
import style from "./stylePages/panelAdmin.module.scss"
import Loading from "../components/forms/Loading"

export default function PanelFields() {
    const [fields, setFields] = useState([])
    const [categories, setCategories] = useState([])
    const [message, setMessage] = useState("")

    const [editField, setEditField] = useState(null)
    const [editFieldForm, setEditFieldForm] = useState({ nombre: "", descripcion: "", precio: "", imagen: "", categoryId: "" })
    const [deleteField, setDeleteField] = useState(null)
    const [showCreateField, setShowCreateField] = useState(false)
    const [createFieldForm, setCreateFieldForm] = useState({ nombre: "", descripcion: "", precio: "", imagen: "", escaparate: false, categoryId: "" })

    const [editCategory, setEditCategory] = useState(null)
    const [editCategoryForm, setEditCategoryForm] = useState({ nombre: "", descripcion: "" })
    const [deleteCategory, setDeleteCategory] = useState(null)
    const [showCreateCategory, setShowCreateCategory] = useState(false)
    const [createCategoryForm, setCreateCategoryForm] = useState({ nombre: "", descripcion: "" })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [fieldsData, categoriesData] = await Promise.all([
                    getAdminFieldsRequest(),
                    getAdminCategoriesRequest()
                ])
                setFields(fieldsData.fields || [])
                setCategories(categoriesData.categories || [])
            } catch (error) {
                setMessage("No se pudieron cargar los datos.")
            }finally { setIsLoading(false) }
        }
        load()
    }, [])


    const handleCreateField = async () => {
        try {
            const newField = await createAdminFieldRequest(createFieldForm)
            setFields((prev) => [...prev, newField])
            setShowCreateField(false)
            setCreateFieldForm({ nombre: "", descripcion: "", precio: "", imagen: "", escaparate: false, categoryId: "" })
            setMessage("Campo creado correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo crear el campo.")
        }
    }

    const openEditField = (field) => {
        setEditField(field)
        setEditFieldForm({
            nombre: field.nombre,
            descripcion: field.descripcion || "",
            precio: field.precio,
            imagen: field.imagen || "",
            categoryId: field.categoryId
        })
    }

    const handleUpdateField = async () => {
        try {
            const updated = await updateAdminFieldRequest(editField.id, editFieldForm)
            setFields((prev) => prev.map((f) => f.id === editField.id ? updated : f))
            setEditField(null)
            setMessage("Campo actualizado correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo actualizar el campo.")
        }
    }

    const handleToggleField = async (fieldId) => {
        try {
            const updated = await toggleAdminFieldRequest(fieldId)
            setFields((prev) => prev.map((f) => f.id === fieldId ? { ...f, escaparate: updated.escaparate } : f))
        } catch (error) {
            setMessage(error.message || "No se pudo cambiar la visibilidad.")
        }
    }

    const handleDeleteField = async () => {
        try {
            await deleteAdminFieldRequest(deleteField.id)
            setFields((prev) => prev.filter((f) => f.id !== deleteField.id))
            setDeleteField(null)
            setMessage("Campo eliminado correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo eliminar el campo.")
        }
    }

    const handleCreateCategory = async () => {
        try {
            const newCat = await createAdminCategoryRequest(createCategoryForm)
            setCategories((prev) => [...prev, newCat])
            setShowCreateCategory(false)
            setCreateCategoryForm({ nombre: "", descripcion: "" })
            setMessage("Categoría creada correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo crear la categoría.")
        }
    }

    const openEditCategory = (cat) => {
        setEditCategory(cat)
        setEditCategoryForm({ nombre: cat.nombre, descripcion: cat.descripcion || "" })
    }

    const handleUpdateCategory = async () => {
        try {
            const updated = await updateAdminCategoryRequest(editCategory.id, editCategoryForm)
            setCategories((prev) => prev.map((c) => c.id === editCategory.id ? updated : c))
            setEditCategory(null)
            setMessage("Categoría actualizada correctamente.")
        } catch (error) {
            setMessage(error.message || "No se pudo actualizar la categoría.")
        }
    }

    const handleDeleteCategory = async () => {
        try {
            await deleteAdminCategoryRequest(deleteCategory.id)
            setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id))
            setDeleteCategory(null)  
            setMessage("Categoría eliminada correctamente.")
        } catch (error) {
            setDeleteCategory(null)  
            setMessage(error.message || "No se pudo eliminar la categoría.")
        }
    }
if (isLoading) return <Loading />
    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Administrador</span>
                    <h1>Gestión de campos y categorías</h1>
                </section>

                {message ? <p className="message">{message}</p> : null}

                <section className={`cardBase ${style.matches}`}>
                    <div className={style.sectionTop}>
                        <h2>Campos</h2>
                        <p>Listado de campos de fútbol en KickMatch</p>
                        <button className="btnOne" type="button" onClick={() => setShowCreateField(true)}>
                            Crear campo
                        </button>
                    </div>

                    <div className={style.tableBox}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Escaparate</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.length > 0 ? fields.map((field) => (
                                    <tr key={field.id}>
                                        <td>{field.nombre}</td>
                                        <td>{field.category?.nombre || "Sin categoría"}</td>
                                        <td>{field.precio} €</td>
                                        <td>{field.escaparate ? "Sí" : "No"}</td>
                                        <td>
                                            <div className={style.buttons}>
                                                <button className={style.btnEdit} type="button" onClick={() => openEditField(field)}>Editar</button>
                                                <button className={style.btnCancel} type="button" onClick={() => handleToggleField(field.id)}>
                                                    {field.escaparate ? "Ocultar" : "Mostrar"}
                                                </button>
                                                <button className={style.btnDelete} type="button" onClick={() => setDeleteField(field)}>Borrar</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5">No hay campos creados.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className={`cardBase ${style.matches}`}>
                    <div className={style.sectionTop}>
                        <h2>Categorías</h2>
                        <p>Listado de categorias de los campos de fútbol en KickMatch</p>
                        <button className="btnOne" type="button" onClick={() => setShowCreateCategory(true)}>
                            Crear categoría
                        </button>
                    </div>

                    <div className={style.tableBox}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>{cat.nombre}</td>
                                        <td>{cat.descripcion || "Sin descripción"}</td>
                                        <td>
                                            <div className={style.buttons}>
                                                <button className={style.btnEdit} type="button" onClick={() => openEditCategory(cat)}>Editar</button>
                                                <button className={style.btnDelete} type="button" onClick={() => setDeleteCategory(cat)}>Borrar</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3">No hay categorías creadas.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {showCreateField && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={() => setShowCreateField(false)}>x</button>
                            <h2>Crear campo</h2>
                            {["nombre", "descripcion", "precio", "imagen"].map((field) => (
                                <div className={style.formGroup} key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input className="inputBase" value={createFieldForm[field]}
                                        type={field === "precio" ? "number" : "text"}
                                        onChange={(e) => setCreateFieldForm((p) => ({ ...p, [field]: e.target.value }))} />
                                </div>
                            ))}
                            <div className={style.formGroup}>
                                <label>Categoría</label>
                                <select className="inputBase" value={createFieldForm.categoryId}
                                    onChange={(e) => setCreateFieldForm((p) => ({ ...p, categoryId: e.target.value }))}>
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={style.formGroup}>
                                <label>
                                    <input type="checkbox" checked={createFieldForm.escaparate}
                                        onChange={(e) => setCreateFieldForm((p) => ({ ...p, escaparate: e.target.checked }))} />
                                    {" "}Mostrar en escaparate
                                </label>
                            </div>
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleCreateField}>Crear</button>
                                <button className="btnTwo" type="button" onClick={() => setShowCreateField(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {editField && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={() => setEditField(null)}>x</button>
                            <h2>Editar campo</h2>
                            {["nombre", "descripcion", "precio", "imagen"].map((field) => (
                                <div className={style.formGroup} key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input className="inputBase" value={editFieldForm[field]}
                                        type={field === "precio" ? "number" : "text"}
                                        onChange={(e) => setEditFieldForm((p) => ({ ...p, [field]: e.target.value }))} />
                                </div>
                            ))}
                            <div className={style.formGroup}>
                                <label>Categoría</label>
                                <select className="inputBase" value={editFieldForm.categoryId}
                                    onChange={(e) => setEditFieldForm((p) => ({ ...p, categoryId: e.target.value }))}>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleUpdateField}>Guardar</button>
                                <button className="btnTwo" type="button" onClick={() => setEditField(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteField && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={() => setDeleteField(null)}>x</button>
                            <h2>Eliminar campo</h2>
                            <p>¿Seguro que quieres eliminar <strong>{deleteField.nombre}</strong>? Esta acción no se puede deshacer.</p>
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleDeleteField}>Confirmar</button>
                                <button className="btnTwo" type="button" onClick={() => setDeleteField(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showCreateCategory && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={() => setShowCreateCategory(false)}>x</button>
                            <h2>Crear categoría</h2>
                            {["nombre", "descripcion"].map((field) => (
                                <div className={style.formGroup} key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input className="inputBase" value={createCategoryForm[field]}
                                        onChange={(e) => setCreateCategoryForm((p) => ({ ...p, [field]: e.target.value }))} />
                                </div>
                            ))}
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleCreateCategory}>Crear</button>
                                <button className="btnTwo" type="button" onClick={() => setShowCreateCategory(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {editCategory && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={() => setEditCategory(null)}>x</button>
                            <h2>Editar categoría</h2>
                            {["nombre", "descripcion"].map((field) => (
                                <div className={style.formGroup} key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input className="inputBase" value={editCategoryForm[field]}
                                        onChange={(e) => setEditCategoryForm((p) => ({ ...p, [field]: e.target.value }))} />
                                </div>
                            ))}
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleUpdateCategory}>Guardar</button>
                                <button className="btnTwo" type="button" onClick={() => setEditCategory(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteCategory && (
                    <div className={style.deletePopup}>
                        <div className={style.deletePopupCard}>
                            <button className={style.btnClose} type="button" onClick={() => setDeleteCategory(null)}>x</button>
                            <h2>Eliminar categoría</h2>
                            <p>¿Seguro que quieres eliminar <strong>{deleteCategory.nombre}</strong>?</p>
                            <div className="groupBtns">
                                <button className="btnOne" type="button" onClick={handleDeleteCategory}>Confirmar</button>
                                <button className="btnTwo" type="button" onClick={() => setDeleteCategory(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}