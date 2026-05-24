import { log } from "node:console"

export const createMatch = async (req, res) => {
    const { date, time, location, maxPlayers, state, creatorId } = req.body
    try {
        const match = await prisma.match.create({
            data: {
                date,
                time,
                location,
                maxPlayers,
                state,
                creatorId,
            }
        })
        return res.status(201).json({
            message: "Partido creado correctamente",
            match: {
                date: match.date,
                time: match.time,
                location: match.location,
                creatorId: match.creatorId
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error interno en el servidor" })
    }
}
export const getMatches = async (req, res) => {
    try {
        const matches = await prisma.match.findMany({
            include: {
                creator: true
            },
            orderBy: {
                date: "desc"
            }
        })
        return res.status(200).json({ matches })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error interno del servidor", error })
    }
}

export const myMatches = async (req, res) => {
    const id = req.user.id
    try {
        const matches = await prisma.match.findMany({
            include: {
                creator: true
            },
            where: {
                creatorId: id
            },
            orderBy: {
                date: "asc"
            }
        })
        return res.status(200).json({ matches })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error interno del servidor", error })
    }
}
const deleteMatch = async (req, res) => {
    const matchId = req.body.matchId
    try {
        await prisma.match.delete({
            where: {
                id: parseInt(matchId)
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error interno del servido", error })
    }
}
export const updateMatch = async (req, res) => {
    const { id } = req.params
    const { date, time, location, maxPlayers, state } = req.body
    const requestingUser = req.user  // del middleware de auth

    try {
        const match = await prisma.match.findUnique({
            where: { id: Number(id) }
        })

        if (!match) {
            return res.status(404).json({ message: "Partido no encontrado." })
        }

        const isCreator = match.creatorId === requestingUser.id
        const isAdmin = requestingUser.rolId === 1  // ajusta según tu rol de admin

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: "No tienes permiso para editar este partido." })
        }

        const updated = await prisma.match.update({
            where: { id: Number(id) },
            data: {
                ...(date && { date: new Date(date) }),
                ...(time && { time: new Date(`1970-01-01T${time}:00.000Z`) }),
                ...(location && { location }),
                ...(maxPlayers && { maxPlayers: Number(maxPlayers) }),
                ...(state && { state }),
            }
        })

        return res.status(200).json(updated)

    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el partido.", error })
    }
}
export const cancelMatch = async (req, res) => {
    const { id } = req.params
    const requestingUser = req.user

    try {
        const match = await prisma.match.findUnique({
            where: { id: Number(id) }
        })

        if (!match) {
            return res.status(404).json({ message: "Partido no encontrado." })
        }

        const isCreator = match.creatorId === requestingUser.id
        const isAdmin = requestingUser.rolId === 1

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: "No tienes permiso para cancelar este partido." })
        }

        const cancelled = await prisma.match.update({
            where: { id: Number(id) },
            data: { state: "cancelado" }
        })

        return res.status(200).json(cancelled)

    } catch (error) {
        return res.status(500).json({ message: "Error al cancelar el partido.", error: error.message })
    }
}
