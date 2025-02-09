import { API_URL, getAuthHeaders } from "./config";

// Buscar todos os países
export async function fetchCountries() {
  const response = await fetch(`${API_URL}/countries/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar países");
  return response.json();
}

// Criar um novo país
export async function createCountry(name: string) {
  const response = await fetch(`${API_URL}/countries/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar país");
  }
  return response.json();
}

// Excluir um país
export async function deleteCountry(countryId: number) {
  const response = await fetch(`${API_URL}/countries/${countryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir país");
  }
  return response.json();
}
