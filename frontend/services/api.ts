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
export async function updateUser(userId: number, data: {
  username?: string;
  password?: string;
  full_name?: string;
  is_active?: boolean;
}) {
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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar país");
  }
  return response.json();
}

// Excluir um país
export async function deleteCountry(countryId: number) {
  const response = await fetch(`${API_URL}/countries/${countryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir país");
  }
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

// Buscar todas as turmas
export async function fetchClassrooms() {
  const response = await fetch(`${API_URL}/classrooms/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar turmas");
  return response.json();
}

// Teacher-specific functions
export async function fetchTeachers() {
  const response = await fetch(`${API_URL}/users/teachers`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar professores");
  return response.json();
}

export async function createTeacher(data: {
  username: string;
  password: string;
  full_name?: string;
  classrooms?: number[];
}) {
  // First create the user
  const userResponse = await createUser({
    username: data.username,
    full_name: data.full_name,
    is_active: true,
    is_superuser: false,
    password: data.password,
  });

  // Then create the teacher profile
  const teacherResponse = await fetch(`${API_URL}/users/teachers?user_id=${userResponse.id}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!teacherResponse.ok) {
    const errorData = await teacherResponse.json();
    throw new Error(errorData.detail || "Erro ao criar perfil do professor");
  }

  // If classrooms were provided, add them to the teacher
  if (data.classrooms && data.classrooms.length > 0) {
    for (const classroomId of data.classrooms) {
      await fetch(`${API_URL}/classrooms/${classroomId}/add_teacher?user_id=${userResponse.id}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    }
  }

  return teacherResponse.json();
}

export async function updateTeacher(userId: number, data: {
  username?: string;
  password?: string;
  full_name?: string;
  classrooms?: number[];
}) {
  // Update user data
  const userResponse = await updateUser(userId, {
    username: data.username,
    password: data.password,
    full_name: data.full_name,
  });

  if (!userResponse) {
    throw new Error("Erro ao atualizar dados do professor");
  }

  // Update classroom assignments if provided
  if (data.classrooms) {
    // First remove teacher from all classrooms
    const currentTeacher = await fetch(`${API_URL}/users/teachers/${userId}`, {
      headers: getAuthHeaders(),
    }).then(res => res.json());

    for (const classroom of currentTeacher.classrooms || []) {
      await fetch(`${API_URL}/classrooms/${classroom.id}/remove_teacher`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id: userId }),
      });
    }

    // Then add teacher to selected classrooms
    for (const classroomId of data.classrooms) {
      await fetch(`${API_URL}/classrooms/${classroomId}/add_teacher`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id: userId }),
      });
    }
  }

  return userResponse;
}

export async function deleteTeacher(userId: number) {
  const response = await deleteUser(userId);
  if (!response) {
    throw new Error("Erro ao deletar professor");
  }
  return response;
}

export async function fetchStudent() {
  const response = await fetch(`${API_URL}/users/students`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar alunos");
  return response.json();
}

export async function createStudent(data: {
  username: string;
  password: string;
  full_name?: string;
  classrooms?: number[];
}) {
  // First create the user
  const userResponse = await createUser({
    username: data.username,
    full_name: data.full_name,
    is_active: true,
    is_superuser: false,
    password: data.password,
  });

  // Then create the student profile with classroom_id
  if (!data.classrooms || data.classrooms.length === 0) {
    throw new Error("É necessário selecionar uma turma");
  }

  const classroomId = data.classrooms[0]; // Get the first classroom since students can only be in one
  const studentResponse = await fetch(`${API_URL}/users/students?user_id=${userResponse.id}&classroom_id=${classroomId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!studentResponse.ok) {
    const errorData = await studentResponse.json();
    throw new Error(errorData.detail || "Erro ao criar perfil do aluno");
  }

  return studentResponse.json();
}

export async function updateStudent(userId: number, data: {
  username?: string;
  password?: string;
  full_name?: string;
  classrooms?: number[];
}) {
  // Update user data
  const userResponse = await updateUser(userId, {
    username: data.username,
    password: data.password,
    full_name: data.full_name,
  });

  if (!userResponse) {
    throw new Error("Erro ao atualizar dados do aluno");
  }

  // Update classroom assignment if provided
  if (data.classrooms && data.classrooms.length > 0) {
    const classroomId = data.classrooms[0]; // Get the first classroom since students can only be in one
    const response = await fetch(`${API_URL}/classrooms/${classroomId}/add_student?user_id=${userId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao atualizar turma do aluno");
    }
  }

  return userResponse;
}

export async function deleteStudent(userId: number) {
  const response = await deleteUser(userId);
  if (!response) {
    throw new Error("Erro ao deletar aluno");
  }
  return response;
}