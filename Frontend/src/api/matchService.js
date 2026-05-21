import { API_URL } from "./authService"

export async function myMatchesRequest(userId) {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/match/myMatches`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.json()
}
export async function allMatches() {
    const response = await fetch(`${API_URL}/match/getMatches`)

    return response.json()
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