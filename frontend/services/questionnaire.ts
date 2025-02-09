import { API_URL, getAuthHeaders } from './config';

export interface QuestionnaireUpdate {
  released?: boolean;
  closed?: boolean;
}

export async function fetchQuestionnaires(classroomId: number) {
  const response = await fetch(`${API_URL}/questionnaire/classroom/${classroomId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch questionnaires');
  }

  return response.json();
}

export async function getQuestionnaire(id: number) {
  const response = await fetch(`${API_URL}/questionnaire/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch questionnaire');
  }

  return response.json();
}

export async function createQuestionnaire(data: {
  classroom_id: number;
  duration: number;
  question_ids: number[];
}) {
  const response = await fetch(`${API_URL}/questionnaire`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create questionnaire');
  }

  return response.json();
}


export async function updateQuestionnaire(id: number, data: QuestionnaireUpdate) {
  const response = await fetch(`${API_URL}/questionnaire/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update questionnaire');
  }

  return response.json();
}
