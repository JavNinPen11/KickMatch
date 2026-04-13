const API_URL = process.env.REACT_APP_BACKEND_URL;

async function parseResponse(response) {
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || "Error en la petición");
  }

  return body;
}

export async function getMeRequest(token) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function updateMeRequest(token, payload) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteMeRequest(token) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}
