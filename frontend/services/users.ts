import { API_URL, getAuthHeaders } from "./config";

// Buscar todos os usuários
export async function fetchUsers() {
  const response = await fetch(`${API_URL}/users/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar usuários");
  return response.json();
}

// Criar um novo usuário
export async function createUser(data: {
  username: string;
  password: string;
  full_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}) {
  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar usuário");
  }
  return response.json();
}

// Atualizar um usuário
export async function updateUser(
  userId: number,
  data: { username?: string; password?: string; full_name?: string; is_active?: boolean }
) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao atualizar usuário");
  }
  return response.json();
}

// Excluir um usuário
export async function deleteUser(userId: number) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir usuário");
  }
  return response.json();
}
