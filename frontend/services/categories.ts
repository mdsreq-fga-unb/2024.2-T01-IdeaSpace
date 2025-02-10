import { API_URL, getAuthHeaders } from "./config";

export interface Category {
  id: number;
  name: string;
  slug_name: string;
}

// Buscar categorias
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/category/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar categorias");
  }
  return response.json();
}

// Criar categoria
export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(`${API_URL}/category`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar categoria");
  }
  return response.json();
}

// Excluir categoria
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/category/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir categoria");
  }
}
