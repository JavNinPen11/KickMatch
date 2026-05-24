import bcrypt from "bcrypt"
const userSelect = {
    id: true,
    username: true,
    nombre: true,
    email: true,
    rolId: true,
    creadoEn: true,
    rol: { select: { nombre: true } }
}

const mapUser = (user) => ({
    id: user.id,
    username: user.username,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol?.nombre ?? null,
    creadoEn: user.creadoEn,
})

export const getAllMatches = async (req, res) => {
    try {
        const matches = await prisma.match.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        nombre: true,
                        rol: { select: { nombre: true } }
                    }
                }
            },
            orderBy: {
                date: "asc"
            }
        })
        return res.status(200).json({
            matches
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error interno del servidor", error })
    }
}
export async function adminUpdateUser(req, res) {
    const { email, username, nombre, password, rolId } = req.body
    const data = {}

    if (typeof email === "string" && email.trim()) {
        data.email = email.trim().toLowerCase()
    }

    if (typeof username === "string" && username.trim()) {
        data.username = username.trim()
    }

    if (typeof nombre === "string" && nombre.trim()) {
        data.nombre = nombre.trim()
    }

    if (typeof password === "string" && password.trim()) {
        data.password = await bcrypt.hash(password, 10)
    }

    if (rolId) {
        data.rolId = Number(rolId)
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ ok: false, message: "No enviaste campos válidos para actualizar" })
    }

    try {
        const updated = await prisma.user.update({
            where: { id: Number(req.params.id) },  // ← diferencia clave
            data,
            select: userSelect,
        })

        return res.json({ ok: true, message: "Usuario actualizado", data: mapUser(updated) })

    } catch (error) {
        console.error("Error adminUpdateUser:", error)
        if (error.code === "P2002") {
            return res.status(400).json({ ok: false, message: "Email o username ya existe" })
        }
        return res.status(500).json({ ok: false, message: "Error interno del servidor" })
    }
}
export async function adminDeleteUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) }
        })

        if (!user) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado." })
        }

        await prisma.user.delete({
            where: { id: Number(req.params.id) }
        })

        return res.json({ ok: true, message: "Usuario eliminado.", data: null })

    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error interno del servidor" })
    }
}