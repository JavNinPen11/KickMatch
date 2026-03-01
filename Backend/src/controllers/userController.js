import bcrypt from "bcrypt";
import { prisma } from "../../lib/db.js";

const userSelect = {
  id: true,
  username: true,
  email: true,
  nombre: true,
  creadoEn: true,
  rol: { select: { nombre: true } },
};

function mapUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nombre: user.nombre,
    creadoEn: user.creadoEn,
    rol: user.rol?.nombre ?? null,
  };
}

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.json({
      ok: true,
      message: "Perfil obtenido",
      data: mapUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      data: null,
    });
  }
}

export async function updateMe(req, res) {
  const { email, username, nombre, password } = req.body;
  const data = {};

  if (typeof email === "string" && email.trim()) {
    data.email = email.trim().toLowerCase();
  }

  if (typeof username === "string" && username.trim()) {
    data.username = username.trim();
  }

  if (typeof nombre === "string" && nombre.trim()) {
    data.nombre = nombre.trim();
  }

  if (typeof password === "string" && password.trim()) {
    data.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "No enviaste campos válidos para actualizar",
      data: null,
    });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: userSelect,
    });

    return res.json({
      ok: true,
      message: "Usuario actualizado",
      data: mapUser(updated),
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        ok: false,
        message: "Email o username ya existe",
        data: null,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      data: null,
    });
  }
}

export async function deleteMe(req, res) {
  try {
    await prisma.user.delete({
      where: { id: req.user.id },
    });

    return res.json({
      ok: true,
      message: "Usuario eliminado",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      data: null,
    });
  }
}
