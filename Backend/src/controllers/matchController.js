import { log } from "node:console"

export const createMatch = async (req, res) => {
    const { date, time, location, maxPlayers, state } = req.body  // quita creatorId
    try {
        const match = await prisma.match.create({
            data: {
                date,
                time,
                location,
                maxPlayers,
                state,
                creatorId: req.user.id  // ← del token
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
export const deleteMatch = async (req, res) => {
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
            return res.status(403).json({ message: "No tienes permiso para eliminar este partido." })
        }

        await prisma.match.delete({
            where: { id: Number(id) }
        })

        return res.status(200).json({ message: "Partido eliminado correctamente." })

    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el partido.", error: error.message })
    }
}
export const joinMatch = async (req, res) => {
    const { id } = req.params
    const requestingUser = req.user

    try {
        const match = await prisma.match.findUnique({
            where: { id: Number(id) },
            include: { participants: true }
        })

        if (!match) {
            return res.status(404).json({ message: "Partido no encontrado." })
        }

        if (match.state !== "abierto") {
            return res.status(400).json({ message: "El partido no está abierto." })
        }

        if (match.creatorId === requestingUser.id) {
            return res.status(400).json({ message: "El creador no puede apuntarse a su propio partido." })
        }

        if (match.participants.length >= match.maxPlayers) {
            return res.status(400).json({ message: "El partido está completo." })
        }

        const alreadyJoined = match.participants.some(p => p.userId === requestingUser.id)
        if (alreadyJoined) {
            return res.status(400).json({ message: "Ya estás apuntado a este partido." })
        }

        await prisma.matchParticipant.create({
            data: {
                matchId: Number(id),
                userId: requestingUser.id
            }
        })

        // Si se llena, actualiza el estado a completo
        if (match.participants.length + 1 >= match.maxPlayers) {
            await prisma.match.update({
                where: { id: Number(id) },
                data: { state: "completo" }
            })
        }

        return res.status(200).json({ message: "Te has apuntado correctamente." })

    } catch (error) {
        return res.status(500).json({ message: "Error al apuntarse al partido.", error: error.message })
    }
}