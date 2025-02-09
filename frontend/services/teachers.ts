import { API_URL, getAuthHeaders } from "./config";
import { createUser, updateUser, deleteUser } from "./users";

// Buscar todos os professores
export async function fetchTeachers() {
  const response = await fetch(`${API_URL}/users/teachers`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar professores");
  return response.json();
}

// Criar perfil de professor
export async function createTeacher(data: {
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

  // Em seguida, cria o perfil de professor
  const teacherResponse = await fetch(
    `${API_URL}/users/teachers?user_id=${userResponse.id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );
  if (!teacherResponse.ok) {
    const errorData = await teacherResponse.json();
    throw new Error(errorData.detail || "Erro ao criar perfil do professor");
  }

  // Se turmas foram informadas, adiciona o professor a cada uma
  if (data.classrooms && data.classrooms.length > 0) {
    for (const classroomId of data.classrooms) {
      await fetch(
        `${API_URL}/classrooms/${classroomId}/add_teacher?user_id=${userResponse.id}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
    }
  }

  return teacherResponse.json();
}

// Atualizar dados do professor
export async function updateTeacher(
  userId: number,
  data: { username?: string; password?: string; full_name?: string; classrooms?: number[] }
) {
  // Atualiza os dados do usuário
  const userResponse = await updateUser(userId, {
    username: data.username,
    password: data.password,
    full_name: data.full_name,
  });
  if (!userResponse) throw new Error("Erro ao atualizar dados do professor");

  // Atualiza as turmas associadas, se informadas
  if (data.classrooms) {
    // Exemplo: aqui você pode implementar a lógica de atualização das turmas
    // removendo o professor das turmas atuais e adicionando-o às novas
  }
  return userResponse;
}

// Excluir professor
export async function deleteTeacher(userId: number) {
  const response = await deleteUser(userId);
  if (!response) throw new Error("Erro ao deletar professor");
  return response;
}
