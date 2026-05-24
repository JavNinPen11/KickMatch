import { API_URL } from "./authService"

async function parseResponse(response) {
    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message || "Error en la petición")
    }

    return body
}

export async function getAdminMatchesRequest() {
    const token = localStorage.getItem("token")

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
export async function updateAdminUserRequest(token, userId, formData) {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    })

    return parseResponse(response)
}
export async function deleteAdminUserRequest(token, userId) {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return parseResponse(response)
}