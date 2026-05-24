import { API_URL } from "./authService"

async function parseResponse(response) {
    const body = await response.json()
    if (!response.ok) throw new Error(body.message || "Error en la petición")
    return body
}

const getToken = () => localStorage.getItem("token")

export async function getEscaparateRequest(categoryId) {
    const url = categoryId
        ? `${API_URL}/fields/escaparate?categoryId=${categoryId}`
        : `${API_URL}/fields/escaparate`

    const response = await fetch(url)
    const body = await parseResponse(response)
    return body.fields || []
}

export async function getCategoriesRequest() {
    const response = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    const body = await parseResponse(response)
    return body.categories || []
}

export async function getCarritoRequest() {
    const response = await fetch(`${API_URL}/reservas/carrito`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    const body = await parseResponse(response)
    return body.carrito
}

export async function addToCarritoRequest(data) {
    const response = await fetch(`${API_URL}/reservas/carrito`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    })
    return parseResponse(response)
}

export async function confirmarReservaRequest() {
    const response = await fetch(`${API_URL}/reservas/confirmar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    return parseResponse(response)
}

export async function eliminarLineaRequest(lineaId) {
    const response = await fetch(`${API_URL}/reservas/carrito/${lineaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    return parseResponse(response)
}

export async function getMyReservasRequest() {
    const response = await fetch(`${API_URL}/reservas`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    const body = await parseResponse(response)
    return body.reservas || []
}

export async function cancelarReservaRequest(reservaId) {
    const response = await fetch(`${API_URL}/reservas/${reservaId}/cancelar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    return parseResponse(response)
}