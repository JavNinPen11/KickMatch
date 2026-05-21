import { API_URL } from "./authService"

async function parseResponse(response) {
    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message || "Error en la petición")
    }

    return body
}

export async function getAdminMatchesRequest(token) {
    const response = await fetch(`${API_URL}/admin/getMatches`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const body = await parseResponse(response)

    return body.matches || []
}

export async function getAdminUsersRequest(token) {
    const response = await fetch(`${API_URL}/admin/getUsers`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const body = await parseResponse(response)

    return body.users || []
}