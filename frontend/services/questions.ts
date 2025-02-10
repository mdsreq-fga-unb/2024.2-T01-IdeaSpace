import { API_URL, getAuthHeaders } from "./config";

export interface Question {
  id: number;
  text: string;
  category_id: number;
  difficulty: 'easy' | 'medium' | 'hard';
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

// Mapeamento de dificuldades
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

// Tipo para as chaves do mapeamento reverso
type BackendDifficulty = keyof typeof reverseDifficultyMapping;

// Buscar questões
export async function fetchQuestions() {
  const response = await fetch(`${API_URL}/questions/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao buscar questões");
  }

  const data = await response.json();
  // Converte a dificuldade do formato do backend para o frontend
  return data.map((question: any) => ({
    ...question,
    difficulty: reverseDifficultyMapping[question.difficulty as BackendDifficulty],
  }));
}

// Criar questão
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
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    difficulty: reverseDifficultyMapping[responseData.difficulty as BackendDifficulty],
  };
}

// Buscar uma questão
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
    difficulty: reverseDifficultyMapping[data.difficulty as BackendDifficulty],
    options: data.options || []
  };
}

// Excluir uma questão
export async function deleteQuestion(questionId: number) {
  const response = await fetch(`${API_URL}/questions/${questionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao excluir questão");
  }
  return response.json();
}

// Atualizar uma questão
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
    difficulty: reverseDifficultyMapping[responseData.difficulty as BackendDifficulty],
  };
}

// Criar opção para uma questão
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

// Atualizar opção de questão
export async function updateQuestionOption(optionId: number, text: string, is_answer: boolean) {
  const url = `${API_URL}/questions/options/${optionId}?option_text=${encodeURIComponent(text)}&is_answer=${is_answer}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao atualizar opção");
  }
  return response.json();
}

// Excluir opção de questão
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
