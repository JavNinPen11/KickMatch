const API_URL = process.env.REACT_APP_BACKEND_URL

export async function loginRequest(username, password) {
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    })
    return response.json()
}
export async function registerRequest(email, username, password)  {
    const response = await fetch(`${API_URL}/auth/register`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, username, password})
    })
    return response.json()
}