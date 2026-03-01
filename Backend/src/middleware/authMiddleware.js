import jwt from "jsonwebtoken";
import { prisma } from "../../lib/db.js";

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Token requerido",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        rol: { select: { nombre: true } },
      },
    });

    if (!dbUser) {
      return res.status(401).json({
        ok: false,
        message: "Usuario del token no existe",
        data: null,
      });
    }

    req.user = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.rol?.nombre ?? null,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
      data: null,
    });
  }
}

// Compatibilidad con imports antiguos
export const authMiddleware = verifyToken;