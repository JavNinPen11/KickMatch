import { prisma } from "../../lib/db.js"

export const getMyReservas = async (req, res) => {
    try {
        const reservas = await prisma.reserva.findMany({
            where: { userId: req.user.id },
            include: {
                lineas: {
                    include: { field: true }
                }
            },
            orderBy: { creadoEn: "desc" }
        })
        return res.status(200).json({ reservas })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const getReservaById = async (req, res) => {
    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                lineas: { include: { field: true } },
                user: { select: { id: true, username: true, email: true } }
            }
        })

        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada." })
        }

        if (reserva.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para ver esta reserva." })
        }

        return res.status(200).json(reserva)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const addToCarrito = async (req, res) => {
    const { fieldId, fecha, horaInicio, horaFin, cantidad } = req.body

    if (!fieldId || !fecha || !horaInicio || !horaFin) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." })
    }

    try {
        const field = await prisma.field.findUnique({
            where: { id: Number(fieldId) }
        })

        if (!field) {
            return res.status(404).json({ message: "Campo no encontrado." })
        }

        // busca reserva pendiente del usuario
        let reserva = await prisma.reserva.findFirst({
            where: { userId: req.user.id, estado: "pendiente" }
        })

        // si no existe, crea una nueva
        if (!reserva) {
            reserva = await prisma.reserva.create({
                data: { userId: req.user.id, estado: "pendiente" }
            })
        }

        const linea = await prisma.reservaLinea.create({
            data: {
                reservaId: reserva.id,
                fieldId: Number(fieldId),
                fecha: new Date(fecha),
                horaInicio,
                horaFin,
                cantidad: Number(cantidad) || 1,
                precio: field.precio
            },
            include: { field: true }
        })

        return res.status(201).json({ reservaId: reserva.id, linea })

    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const getCarrito = async (req, res) => {
    try {
        const reserva = await prisma.reserva.findFirst({
            where: { userId: req.user.id, estado: "pendiente" },
            include: {
                lineas: { include: { field: true } }
            }
        })

        if (!reserva) {
            return res.status(200).json({ carrito: null })
        }

        return res.status(200).json({ carrito: reserva })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const confirmarReserva = async (req, res) => {
    try {
        const reserva = await prisma.reserva.findFirst({
            where: { userId: req.user.id, estado: "pendiente" },
            include: { lineas: true }
        })

        if (!reserva || reserva.lineas.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." })
        }

        const confirmed = await prisma.reserva.update({
            where: { id: reserva.id },
            data: {
                estado: "confirmada",
                confirmadoEn: new Date()
            }
        })

        return res.status(200).json({ message: "Reserva confirmada correctamente.", reserva: confirmed })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const eliminarLinea = async (req, res) => {
    try {
        const linea = await prisma.reservaLinea.findUnique({
            where: { id: Number(req.params.lineaId) },
            include: { reserva: true }
        })

        if (!linea) {
            return res.status(404).json({ message: "Línea no encontrada." })
        }

        if (linea.reserva.userId !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso." })
        }

        await prisma.reservaLinea.delete({
            where: { id: Number(req.params.lineaId) }
        })

        return res.status(200).json({ message: "Línea eliminada correctamente." })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const cancelarReserva = async (req, res) => {
    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: Number(req.params.id) }
        })

        if (!reserva) {
            return res.status(404).json({ message: "Reserva no encontrada." })
        }

        if (reserva.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso." })
        }

        const cancelled = await prisma.reserva.update({
            where: { id: Number(req.params.id) },
            data: { estado: "cancelada" }
        })

        return res.status(200).json({ message: "Reserva cancelada correctamente.", reserva: cancelled })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}