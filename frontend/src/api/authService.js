const API_URL = process.env.REACT_APP_BACKEND_URL

export async function loginRequest(username, password) {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    })
    return response.json()
}