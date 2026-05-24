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

        await prisma.matchParticipant.deleteMany({
            where: { userId: Number(req.params.id) }
        })

        await prisma.match.deleteMany({
            where: { creatorId: Number(req.params.id) }
        })

        await prisma.user.delete({
            where: { id: Number(req.params.id) }
        })

        return res.json({ ok: true, message: "Usuario eliminado.", data: null })

    } catch (error) {
        console.error("Error adminDeleteUser:", error)
        return res.status(500).json({ ok: false, message: "Error interno del servidor" })
    }
}
export const createAdminUser = async (req, res) => {
    const { email, username, nombre, password, rolId } = req.body

    if (!email || !username || !password) {
        return res.status(400).json({ ok: false, message: "Email, username y password son obligatorios." })
    }

    try {
        const hashed = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email: email.trim().toLowerCase(),
                username: username.trim(),
                nombre: nombre?.trim() || "Sin nombre",
                password: hashed,
                rolId: Number(rolId) || 2,
            },
            select: {
                ...userSelect,
                rol: { select: { nombre: true } }
            },
        })

        return res.status(201).json(mapUser(user))

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ ok: false, message: "Email o username ya existe." })
        }
        return res.status(500).json({ ok: false, message: "Error interno del servidor." })
    }
}
export const createAdminMatch = async (req, res) => {
    const { date, time, location, maxPlayers, state, creatorId } = req.body

    if (!date || !time || !location || !maxPlayers) {
        return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios." })
    }

    try {
        const match = await prisma.match.create({
            data: {
                date: new Date(date),
                time: new Date(`1970-01-01T${time}:00.000Z`),
                location,
                maxPlayers: Number(maxPlayers),
                state: state || "abierto",
                creatorId: Number(creatorId) || req.user.id,
            },
            include: { creator: { select: { id: true, username: true } } }
        })

        return res.status(201).json(match)

    } catch (error) {
        console.error("Error createAdminMatch:", error)
        return res.status(500).json({ ok: false, message: "Error interno del servidor." })
    }
}
export const getAdminReservas = async (req, res) => {
    try {
        const reservas = await prisma.reserva.findMany({
            include: {
                user: { select: { id: true, username: true, email: true } },
                lineas: { include: { field: true } }
            },
            orderBy: { creadoEn: "desc" }
        })
        return res.status(200).json({ reservas })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const cancelAdminReserva = async (req, res) => {
    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: Number(req.params.id) }
        })

        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada." })
        }

        const updated = await prisma.reserva.update({
            where: { id: Number(req.params.id) },
            data: { estado: "cancelada" }
        })

        return res.status(200).json({ message: "Reserva cancelada.", reserva: updated })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const deleteAdminReserva = async (req, res) => {
    try {
        await prisma.reservaLinea.deleteMany({
            where: { reservaId: Number(req.params.id) }
        })

        await prisma.reserva.delete({
            where: { id: Number(req.params.id) }
        })

        return res.status(200).json({ message: "Reserva eliminada correctamente." })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}