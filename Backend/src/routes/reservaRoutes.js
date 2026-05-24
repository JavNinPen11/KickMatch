import { Router } from "express"
import { verifyToken } from "../middleware/authMiddleware.js"
import { getMyReservas, getReservaById, addToCarrito, getCarrito, confirmarReserva, eliminarLinea, cancelarReserva } from "../controllers/reservaController.js"

const router = Router()

router.get("/", verifyToken, getMyReservas)
router.get("/carrito", verifyToken, getCarrito)
router.get("/:id", verifyToken, getReservaById)
router.post("/carrito", verifyToken, addToCarrito)
router.post("/confirmar", verifyToken, confirmarReserva)
router.delete("/carrito/:lineaId", verifyToken, eliminarLinea)
router.patch("/:id/cancelar", verifyToken, cancelarReserva)

export default router