import { API_URL } from "./authService"

async function parseResponse(response) {
    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message || "Error en la petición")
    }

    return body
}

function getToken() {
    return localStorage.getItem("token")
}

export async function myMatchesRequest() {

    const response = await fetch(`${API_URL}/match/myMatches`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    })
    return parseResponse(response)
}

export async function allMatches() {
    const response = await fetch(`${API_URL}/match/getMatches`, {
     method: "GET" , 
    })

    return parseResponse(response)
}

export async function createMatchRequest(matchData) {

    const response = await fetch(`${API_URL}/match/createMatch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(matchData),
    })

    return parseResponse(response)
}

export async function joinMatchRequest(matchId) {
    const response = await fetch(`${API_URL}/match/${matchId}/join`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    })

    return parseResponse(response)
}

// export async function updateMatchRequest(matchId, matchData) {
//     const response = await fetch(`${API_URL}/match/${matchId}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify(matchData),
//     })

//     return parseResponse(response)
// }

export async function cancelMatchRequest(matchId) {
    const response = await fetch(`${API_URL}/match/${matchId}/cancel`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    })

    return parseResponse(response)
}
export async function leaveMatchRequest(matchId) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/match/${matchId}/leave`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!response.ok) {
        const body = await response.json()
        throw new Error(body.message || "Error al desapuntarse.")
    }
    return response.json()
}
export async function updateMatchRequest(matchId, formData) {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/match/${matchId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    })
    if (!response.ok) {
        const body = await response.json()
        throw new Error(body.message || "Error al actualizar el partido.")
    }
    return response.json()
}