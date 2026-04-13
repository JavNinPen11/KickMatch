const API_URL = process.env.REACT_APP_BACKEND_URL
// borrar usuario peufeliz, lo uso para entrar
const DEV_USERNAME = "peufeliz"
const DEV_PASSWORD = "12345"
const DEV_LOGIN_RESPONSE = {
    ok: true,
    message: "Login temporal en modo desarrollo",
    username: DEV_USERNAME,
    token: "dev-local-token"
}

export async function loginRequest(username, password) {
    // aqui
    if (!API_URL) {
        if (username === DEV_USERNAME && password === DEV_PASSWORD) {
            return DEV_LOGIN_RESPONSE
        }

        return { ok: false, message: "ok usuario peufelizz" }
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })
        return response.json()
    } catch (error) {
        if (username === DEV_USERNAME && password === DEV_PASSWORD) {
            return DEV_LOGIN_RESPONSE
        }

        return { ok: false, message: "catch" }
    }
}
export async function registerRequest(email, username, password)  {
    const response = await fetch(`${API_URL}/auth/register`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, username, password})
    })
    return response.json()
}
