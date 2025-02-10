import { API_URL, getAuthHeaders } from "./config";
import { createUser, updateUser, deleteUser } from "./users";

// Buscar todos os alunos
export async function fetchStudent() {
  const response = await fetch(`${API_URL}/users/students`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar alunos");
  return response.json();
}

// Criar perfil de aluno
export async function createStudent(data: {
  username: string;
  password: string;
  full_name?: string;
  classrooms?: number[];
}) {
  // Primeiro, cria o usuário
  const userResponse = await createUser({
    username: data.username,
    full_name: data.full_name,
    is_active: true,
    is_superuser: false,
    password: data.password,
  });

  try {
    const studentResponse = await fetch(
      `${API_URL}/users/students?user_id=${userResponse.id}${
        data.classrooms && data.classrooms.length > 0 ? `&classroom_id=${data.classrooms[0]}` : ""
      }`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    if (!studentResponse.ok) {
      const errorData = await studentResponse.json();
      throw new Error(errorData.detail || "Erro ao criar perfil do aluno");
    }
    return studentResponse.json();
  } catch (error) {
    await deleteUser(userResponse.id);
    throw error;
  }
}

// Atualizar dados do aluno
export async function updateStudent(
  userId: number,
  data: { username?: string; password?: string; full_name?: string; classrooms?: number[] }
) {
  // Atualiza os dados do usuário
  const userResponse = await updateUser(userId, {
    username: data.username,
    password: data.password,
    full_name: data.full_name,
  });
  if (!userResponse) throw new Error("Erro ao atualizar dados do aluno");

  // Atualiza a turma associada, se informada (alunos podem pertencer a apenas uma turma)
  if (data.classrooms && data.classrooms.length > 0) {
    const classroomId = data.classrooms[0];
    const response = await fetch(
      `${API_URL}/classrooms/${classroomId}/add_student?user_id=${userId}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao atualizar turma do aluno");
    }
  }
  return userResponse;
}

// Excluir aluno
export async function deleteStudent(userId: number) {
  const response = await deleteUser(userId);
  if (!response) throw new Error("Erro ao deletar aluno");
  return response;
}

// Buscar alunos por localização (país, cidade, escola)
export async function getStudentsByLocation(
  countryId?: number,
  cityId?: number,
  schoolId?: number
) {
  let url = `${API_URL}/users/students?`;
  if (countryId) url += `country_id=${countryId}&`;
  if (cityId) url += `city_id=${cityId}&`;
  if (schoolId) url += `school_id=${schoolId}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar alunos");
  }
  return response.json();
}

export async function getStudentResults(userId: number) {
  const response = await fetch(`${API_URL}/users/${userId}/student`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch student results');
  }

  return response.json();
}
