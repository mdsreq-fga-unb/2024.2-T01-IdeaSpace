import { API_URL } from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  teacher: {
    classrooms: Array<{
      id: number;
      name: string;
      school_id: number;
      slug_name: string;
      school: {
        id: number;
        name: string;
        city_id: number;
        slug_name: string;
        city: {
          id: number;
          name: string;
          country_id: number;
          slug_name: string;
          country: {
            id: number;
            name: string;
            slug_name: string;
          };
        };
      };
    }>;
  } | null;
  student: {
    classroom: {
      id: number;
      name: string;
      school_id: number;
      slug_name: string;
      school: {
        id: number;
        name: string;
        city_id: number;
        slug_name: string;
        city: {
          id: number;
          name: string;
          country_id: number;
          slug_name: string;
          country: {
            id: number;
            name: string;
            slug_name: string;
          };
        };
      };
    };
  } | null;
}

export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/login/access-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Login error details:', errorData);
    throw new Error(errorData?.detail || 'Credenciais inválidas');
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Get user error details:', errorData);
    throw new Error(errorData?.detail || 'Erro ao buscar dados do usuário');
  }

  return response.json();
}