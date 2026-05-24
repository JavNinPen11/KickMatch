import { prisma } from "../../lib/db.js"

export const getFields = async (req, res) => {
    try {
        const fields = await prisma.field.findMany({
            include: { category: true },
            orderBy: { nombre: "asc" }
        })
        return res.status(200).json({ fields })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const getEscaparate = async (req, res) => {
    const { categoryId } = req.query

    try {
        const fields = await prisma.field.findMany({
            where: {
                escaparate: true,
                ...(categoryId && { categoryId: Number(categoryId) })
            },
            include: { category: true },
            orderBy: { nombre: "asc" }
        })
        return res.status(200).json({ fields })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const getFieldById = async (req, res) => {
    try {
        const field = await prisma.field.findUnique({
            where: { id: Number(req.params.id) },
            include: { category: true }
        })

        if (!field) {
            return res.status(404).json({ message: "Campo no encontrado." })
        }

        return res.status(200).json(field)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const createField = async (req, res) => {
    const { nombre, descripcion, precio, imagen, escaparate, categoryId } = req.body

    if (!nombre || !precio || !categoryId) {
        return res.status(400).json({ message: "Nombre, precio y categoría son obligatorios." })
    }

    try {
        const field = await prisma.field.create({
            data: {
                nombre,
                descripcion,
                precio: Number(precio),
                imagen,
                escaparate: Boolean(escaparate),
                categoryId: Number(categoryId)
            },
            include: { category: true }
        })
        return res.status(201).json(field)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const updateField = async (req, res) => {
    const { nombre, descripcion, precio, imagen, escaparate, categoryId } = req.body

    try {
        const field = await prisma.field.update({
            where: { id: Number(req.params.id) },
            data: {
                ...(nombre && { nombre }),
                ...(descripcion !== undefined && { descripcion }),
                ...(precio && { precio: Number(precio) }),
                ...(imagen !== undefined && { imagen }),
                ...(escaparate !== undefined && { escaparate: Boolean(escaparate) }),
                ...(categoryId && { categoryId: Number(categoryId) })
            },
            include: { category: true }
        })
        return res.status(200).json(field)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const toggleEscaparate = async (req, res) => {
    try {
        const field = await prisma.field.findUnique({
            where: { id: Number(req.params.id) }
        })

        if (!field) {
            return res.status(404).json({ message: "Campo no encontrado." })
        }

        const updated = await prisma.field.update({
            where: { id: Number(req.params.id) },
            data: { escaparate: !field.escaparate }
        })

        return res.status(200).json(updated)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const deleteField = async (req, res) => {
    try {
        await prisma.field.delete({
            where: { id: Number(req.params.id) }
        })
        return res.status(200).json({ message: "Campo eliminado correctamente." })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}