import { API_URL, getAuthHeaders } from "./config";

// Buscar todas as escolas
export async function fetchSchools() {
  const response = await fetch(`${API_URL}/schools/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar escolas");
  return response.json();
}

// Criar uma nova escola
export async function createSchool(name: string, city_id: number) {
  const response = await fetch(`${API_URL}/schools/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, city_id }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar escola");
  }
  return response.json();
}

// Excluir uma escola
export async function deleteSchool(schoolId: number) {
  const response = await fetch(`${API_URL}/schools/${schoolId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir escola");
  }
  return response.json();
}
