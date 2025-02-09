export const API_URL = "http://localhost:8000/api";

// Função auxiliar para obter os headers de autenticação
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

//////////////////////////////////////////////
//                USUÁRIOS                //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//                CIDADES                 //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//                PAÍSES                  //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//                ESCOLAS                 //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//               TURMAS                   //
//////////////////////////////////////////////

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

  const response = await fetch(`${API_URL}/classrooms/${classroomId}?${params.toString()}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

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
    throw new Error(JSON.stringify(errorData.detail) || "Erro ao adicionar aluno à turma");
  }
  return response.json();
}

export async function addTeacherToClassroom(classroomId: number, userId: number) {
  const response = await fetch(`${API_URL}/classrooms/${classroomId}/add_teacher?user_id=${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
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

//Remover aluno de uma turma
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



//////////////////////////////////////////////
//              PROFESSORES               //
//////////////////////////////////////////////

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
    // Remove o professor de todas as turmas atuais
    const currentTeacher = await fetch(`${API_URL}/users/teachers/${userId}`, {
      headers: getAuthHeaders(),
    }).then((res) => res.json());

    for (const classroom of currentTeacher.classrooms || []) {
      await fetch(`${API_URL}/classrooms/${classroom.id}/remove_teacher`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id: userId }),
      });
    }
    // Adiciona o professor às turmas selecionadas
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

// Excluir professor
export async function deleteTeacher(userId: number) {
  const response = await deleteUser(userId);
  if (!response) throw new Error("Erro ao deletar professor");
  return response;
}

//////////////////////////////////////////////
//                ALUNOS                  //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//  QUESTÕES / QUESTIONÁRIOS / OPCÕES      //
//////////////////////////////////////////////


// Criar novo questionário
export async function createQuestionnaire(data: {
  id: number;
  questions: number[];
  classroom_id: number;
  duration: number;
  released?: boolean;
  closed?: boolean;
}) {
  const response = await fetch(`${API_URL}/questionnaire/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar questionário");
  }
  return response.json();
}

// Criar nova opção
export async function createOption(data: {
  text: string;
  is_correct: boolean;
  question_id: number;
}) {
  const response = await fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar opção");
  }
  return response.json();
}
//////////////////////////////////////////////
//                Estatísticas              //
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//                Questões                  //
//////////////////////////////////////////////

// Add these interfaces to the existing services/api.ts file

export interface Question {
  id: number;
  text: string;
  category_id: number;
  difficulty: 'FACIL' | 'MEDIO' | 'DIFICIL';
  category: {
    name: string;
  };
  created_at: string;
  updated_at: string;
  options: Array<{
    id: number;
    text: string;
    is_answer: boolean;
  }>;
}

// Mapping for difficulty levels
const difficultyMapping = {
  easy: 'FACIL',
  medium: 'MEDIO',
  hard: 'DIFICIL',
} as const;

const reverseDifficultyMapping = {
  FACIL: 'easy',
  MEDIO: 'medium',
  DIFICIL: 'hard',
} as const;

export async function fetchQuestions() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/questions/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar questões");
  }

  const data = await response.json();
  // Convert backend difficulty to frontend format
  return data.map((question: any) => ({
    ...question,
    difficulty: reverseDifficultyMapping[question.difficulty],
  }));
}

export async function createQuestion(data: {
  question: {
    text: string;
    category_id: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  options: Array<{
    text: string;
    is_answer: boolean;
  }>;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      question: {
        ...data.question,
        difficulty: difficultyMapping[data.question.difficulty],
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar questão");
  }

  const responseData = await response.json();
  return {
    ...responseData,
    difficulty: reverseDifficultyMapping[responseData.difficulty],
  };
}

export async function getQuestion(id: number): Promise<Question> {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar questão");
  }

  const data = await response.json();
  return {
    ...data,
    difficulty: reverseDifficultyMapping[data.difficulty],
    options: data.options || []
  };
}



export async function deleteQuestion(questionId: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/questions/${questionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir questão");
  }

  return response.json();
}



export interface Category {
  id: number;
  name: string;
  slug_name: string;
}

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

//////////////////////////////////////////////
//                Categorias                //
//////////////////////////////////////////////

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

export async function updateQuestion(questionId: number, data: {
  text?: string;
  category_id?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}) {
  const response = await fetch(`${API_URL}/questions/${questionId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...data,
      difficulty: data.difficulty ? difficultyMapping[data.difficulty] : undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao atualizar questão");
  }

  const responseData = await response.json();
  return {
    ...responseData,
    difficulty: reverseDifficultyMapping[responseData.difficulty],
  };
}

export async function createQuestionOption(questionId: number, data: {
  text: string;
  is_answer: boolean;
}) {
  const response = await fetch(`${API_URL}/questions/${questionId}/options`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar opção");
  }

  return response.json();
}

export async function updateQuestionOption(optionId: number, text: string, is_answer: boolean) {
  const url = `${API_URL}/questions/options/${optionId}?option_text=${encodeURIComponent(text)}&is_answer=${is_answer}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(), // Certifique-se de que esse header inclui o Authorization
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao atualizar opção");
  }

  return response.json();
}



export async function deleteQuestionOption(optionId: number) {
  const response = await fetch(`${API_URL}/questions/options/${optionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir opção");
  }

  return response.json();
}