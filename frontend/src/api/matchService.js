const API_URL = process.env.REACT_APP_BACKEND_URL

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData)
    })
    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message || "No se pudo crear el partido")
    }

    return body
}
