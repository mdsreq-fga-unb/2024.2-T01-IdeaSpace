import { API_URL, getAuthHeaders } from "./config";

// Buscar todas as turmas
export async function fetchClassrooms() {
  const response = await fetch(`${API_URL}/classrooms/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar turmas");
  return response.json();
}

// Criar uma nova turma
export async function createClassroom(data: { name: string; school_id: number }) {
  const response = await fetch(`${API_URL}/classrooms/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar turma");
  }
  return response.json();
}

// Excluir uma turma
export async function deleteClassroom(classroomId: number) {
  const response = await fetch(`${API_URL}/classrooms/${classroomId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir turma");
  }
  return response.json();
}

// Atualizar nome da turma
export async function updateClassroom(
  classroomId: number,
  classroomName: string
) {
  const params = new URLSearchParams({ classroom_name: classroomName });

  const response = await fetch(
    `${API_URL}/classrooms/${classroomId}?${params.toString()}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao atualizar a turma");
  }
  return response.json();
}

// Buscar detalhes de uma turma (com usuários)
export async function getClassroomWithUsers(classroomId: number) {
  const response = await fetch(`${API_URL}/classrooms/${classroomId}/users`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar detalhes da turma");
  }
  return response.json();
}

// Adicionar aluno a uma turma
export async function addStudentToClassroom(classroomId: number, userId: number) {
  const response = await fetch(
    `${API_URL}/classrooms/${classroomId}/add_student?user_id=${userId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao adicionar aluno à turma");
  }
  return response.json();
}

// Adicionar professor a uma turma
export async function addTeacherToClassroom(classroomId: number, userId: number) {
  const response = await fetch(
    `${API_URL}/classrooms/${classroomId}/add_teacher?user_id=${userId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao adicionar professor à turma");
  }
  return response.json();
}

// Remover aluno de uma turma
export async function removeStudentFromClassroom(classroomId: number, userId: number) {
  const response = await fetch(`${API_URL}/users/${userId}/student?classroom=${classroomId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao remover aluno da turma");
  }
  return response.json();
}

// Remover professor de uma turma
export async function removeTeacherFromClassroom(classroomId: number, userId: number) {
  const response = await fetch(`${API_URL}/classrooms/${classroomId}/remove_teacher?user_id=${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao remover professor da turma");
  }
  return response.json();
}
