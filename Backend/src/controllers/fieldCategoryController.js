import { prisma } from "../../lib/db.js"

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.fieldCategory.findMany({
            orderBy: { nombre: "asc" }
        })
        return res.status(200).json({ categories })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const createCategory = async (req, res) => {
    const { nombre, descripcion } = req.body

    if (!nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio." })
    }

    try {
        const category = await prisma.fieldCategory.create({
            data: { nombre, descripcion }
        })
        return res.status(201).json(category)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const updateCategory = async (req, res) => {
    const { nombre, descripcion } = req.body

    try {
        const category = await prisma.fieldCategory.update({
            where: { id: Number(req.params.id) },
            data: { nombre, descripcion }
        })
        return res.status(200).json(category)
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        await prisma.fieldCategory.delete({
            where: { id: Number(req.params.id) }
        })
        return res.status(200).json({ message: "Categoría eliminada correctamente." })
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor.", error: error.message })
    }
}