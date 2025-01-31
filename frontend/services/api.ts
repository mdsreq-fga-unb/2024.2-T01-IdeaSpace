export const API_URL = "http://localhost:8000/api";

// Função auxiliar para obter os headers de autenticação
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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
  role: string;
}) {
  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar usuário");
  return response.json();
}

// Atualizar um usuário
export async function updateUser(userId: number, data: {
  username?: string;
  password?: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
}) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return response.json();
}

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

  if (!response.ok) throw new Error("Erro ao criar cidade");
  return response.json();
}

// Excluir uma cidade
export async function deleteCity(cityId: number) {
  const response = await fetch(`${API_URL}/cities/${cityId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao excluir cidade");
  return response.json();
}

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

  if (!response.ok) throw new Error("Erro ao criar país");
  return response.json();
}

// Excluir um país
export async function deleteCountry(countryId: number) {
  const response = await fetch(`${API_URL}/countries/${countryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao excluir país");
  return response.json();
}

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

  if (!response.ok) throw new Error("Erro ao criar escola");
  return response.json();
}

// Excluir uma escola
export async function deleteSchool(schoolId: number) {
  const response = await fetch(`${API_URL}/schools/${schoolId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao excluir escola");
  return response.json();
}