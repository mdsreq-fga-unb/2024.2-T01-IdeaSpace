export type UserRole = 'aluno' | 'professor' | 'administrador';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export const rolePermissions = {
  aluno: {
    allowedRoutes: [
      '/dashboard',
      '/quiz',
      '/dashboard/desempenho'
    ],
    features: [
      'view_own_profile',
      'take_quizzes',
      'view_own_performance'
    ]
  },
  professor: {
    allowedRoutes: [
      '/dashboard',
      '/dashboard/turmas',
      '/dashboard/questionarios',
      '/dashboard/analise'
    ],
    features: [
      'view_own_profile',
      'manage_class_quizzes',
      'view_class_performance',
      'assign_quizzes'
    ]
  },
  administrador: {
    allowedRoutes: [
      '/dashboard',
      '/dashboard/alunos',
      '/dashboard/turmas',
      '/dashboard/questoes',
      '/dashboard/questionarios',
      '/dashboard/analise',
      '/dashboard/admin'
    ],
    features: [
      'view_own_profile',
      'manage_students',
      'manage_classes',
      'create_questions',
      'manage_quizzes',
      'view_all_performance',
      'manage_teachers',
      'manage_system'
    ]
  }
};