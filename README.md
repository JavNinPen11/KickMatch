# KickMatch 🥅

Plataforma social para la organización de partidos de fútbol amateur, reserva de pistas deportivas y conexión entre jugadores.

Desarrollado por **Javier Santiago Niño Peñaloza** y **Paula Escribano Reina** — DAW, IES Mare Nostrum.

---

## 🌐 Acceso en producción

La aplicación está desplegada y disponible en:

- **Frontend:** https://kickmatch-web.vercel.app/
- **Backend:** https://kickmatch-production.up.railway.app
---

## 🛠️ Tecnologías utilizadas

**Frontend**
- React
- React Router DOM
- SCSS Modules

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT para autenticación

---

## ⚙️ Instalación y ejecución local

### Requisitos previos

- Node.js v18 o superior
- npm
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/JavNinPen11/KickMatch.git
cd kickmatch
```

### 2. Configurar el Backend

```bash
cd Backend
npm install
```

Crea un archivo `.env` en la carpeta `Backend` con las siguientes variables:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

> ⚠️ Contacta con los desarrolladores para obtener las credenciales necesarias.

Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Inicia el servidor:

```bash
npm start
```

El backend estará disponible en `http://localhost:5000`

### 3. Configurar el Frontend

Abre una nueva terminal:

```bash
cd Frontend
npm install
```

Crea un archivo `.env` en la carpeta `Frontend`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

Inicia el frontend:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

---

## 👤 Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Usuario | test@test.com | 1234 |

---

## 📁 Estructura del proyecto

```
KickMatch/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🚀 Funcionalidades principales

- ⚽ Crear y gestionar partidos de fútbol
- 🤝 Apuntarse y desapuntarse de partidos
- 🏟️ Reservar pistas deportivas
- 👤 Gestión de perfil de usuario
- 🔐 Autenticación con JWT
- 🛡️ Panel de administración completo

---

## 📄 Licencia

Proyecto académico — IES Mare Nostrum, DAW 2025-2026