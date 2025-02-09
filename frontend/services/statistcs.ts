import { API_URL, getAuthHeaders } from "./config";

export async function fetchStatistics() {
  const response = await fetch(`${API_URL}/statistics/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar estatísticas");
  }
  return response.json();
}
