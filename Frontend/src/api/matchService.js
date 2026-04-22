const API_URL = process.env.REACT_APP_BACKEND_URL

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
    const maxJugadores = Math.min(Math.max(Number(match.maxJugadores) || 0, 2), 20)
    const participantes = Array.isArray(match.participantes) ? match.participantes : []
    const jugadoresApuntados = Math.min(
        Number(match.jugadoresApuntados ?? participantes.length),
        maxJugadores
    )

    return {
        id: match.id ?? Date.now(),
        fecha: isValidMatchDate(match.fecha) ? match.fecha : getTodayDateString(),
        hora: typeof match.hora === "string" ? match.hora : "",
        ubicacion: typeof match.ubicacion === "string" ? match.ubicacion : "",
        maxJugadores,
        jugadoresApuntados,
        participantes,
        creador: {
            id: match.creador?.id ?? "sin-creador",
            nombre: match.creador?.nombre ?? "Desconocido",
        },
        duracion: match.duracion ? Math.min(Number(match.duracion), 90) : null,
        estado: jugadoresApuntados >= maxJugadores ? "COMPLETO" : "ABIERTO",
    }
}
//hayq conectar la api aqui 
export async function getMatchesRequest() {
 if (!API_URL) {
        throw new Error("Backend de partidos no configurado")
    }

    const response = await fetch(`${API_URL}/matches`)
    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message || "No se pudieron cargar los partidos")
    }

    return body
}

export async function createMatchRequest(matchData) {
    if (!API_URL) {
        throw new Error("Backend de partidos no configurado")
    }

    const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
    })

    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message || "No se pudo crear el partido")
    }

    return body
}
