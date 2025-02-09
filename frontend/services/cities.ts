import { API_URL, getAuthHeaders } from "./config";

// Buscar todas as cidades
export async function fetchCities() {
  const response = await fetch(`${API_URL}/cities/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar cidades");
  return response.json();
}

// Criar uma nova cidade
export async function createCity(name: string, country_id: number) {
  const response = await fetch(`${API_URL}/cities/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, country_id }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar cidade");
  }
  return response.json();
}

// Excluir uma cidade
export async function deleteCity(cityId: number) {
  const response = await fetch(`${API_URL}/cities/${cityId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir cidade");
  }
  return response.json();
}
