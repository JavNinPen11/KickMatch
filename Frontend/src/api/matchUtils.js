
function toDateOnly(dateValue) {
    const date = new Date(dateValue)
    date.setHours(0, 0, 0, 0)
    return date
}

export function getTodayDateString() {
    return new Date().toISOString().split("T")[0]
}

export function getMaxMatchDateString() {
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 6)
    return maxDate.toISOString().split("T")[0]
}

export function isValidMatchDate(fecha) {
    if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false
    }

    const [year, month, day] = fecha.split("-").map(Number)
    const parsedDate = new Date(year, month - 1, day)

    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
    ) {
        return false
    }

    const selectedDate = toDateOnly(parsedDate)
    const minDate = toDateOnly(new Date())
    const maxDate = toDateOnly(new Date(getMaxMatchDateString()))

    return selectedDate >= minDate && selectedDate <= maxDate
}

export function formatMatchDate(fecha) {
    if (typeof fecha !== "string" || !fecha.trim()) {
        return "Fecha no disponible"
    }

    const cleanDate = fecha.trim()

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDate)) {
        return cleanDate
    }

    if (isValidMatchDate(cleanDate)) {
        const [year, month, day] = cleanDate.split("-")
        return `${day}/${month}/${year}`
    }

    return "Fecha no disponible"
}

export function getMatchDisplayName(fecha) {
    if (!isValidMatchDate(fecha)) {
        return "Partido"
    }

    const [year, month, day] = fecha.split("-").map(Number)
    const matchDate = new Date(year, month - 1, day)
    const weekdays = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
    ]
    const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ]

    return `Partido el ${weekdays[matchDate.getDay()]} ${day} de ${months[month - 1]} de ${year}`
}

export function normalizeMatch(match) {
    const maxJugadores = Math.min(Math.max(Number(match.maxJugadores || match.maxPlayers) || 0, 2), 20)
    const participantes = Array.isArray(match.participantes) ? match.participantes : []
    const jugadoresApuntados = Math.min(
        Number(match.jugadoresApuntados ?? participantes.length),
        maxJugadores
    )

    const fecha = isValidMatchDate(match.fecha)
        ? match.fecha
        : match.date?.split("T")[0] ?? getTodayDateString()

    const hora = typeof match.hora === "string" && match.hora
        ? match.hora
        : match.time?.split("T")[1]?.slice(0, 5) ?? ""

    const creador = match.creador ?? match.creator

    return {
        id: match.id ?? Date.now(),
        fecha,
        hora,
        ubicacion: match.ubicacion || match.location || "",
        maxJugadores,
        jugadoresApuntados,
        participantes,
        creador: {
            id: creador?.id ?? "sin-creador",
            nombre: creador?.nombre ?? creador?.username ?? "Desconocido",
        },
        duracion: match.duracion ? Math.min(Number(match.duracion), 90) : null,
        estado: jugadoresApuntados >= maxJugadores ? "COMPLETO" : "ABIERTO",
    }
}

