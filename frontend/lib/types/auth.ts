export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  username: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
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
      '/dashboard/admin',
      '/dashboard/alunos',
      '/dashboard/professores',
      '/dashboard/turmas',
      '/dashboard/questoes',
      '/dashboard/questionarios',
      '/dashboard/analytics'
    ],
    features: [
      'view_own_profile',
      'manage_students',
      'manage_teachers',
      'manage_classes',
      'create_questions',
      'manage_quizzes',
      'view_all_performance',
      'manage_system'
    ]
  }
};

export function mapBackendRole(role: UserRole): 'aluno' | 'professor' | 'administrador' {
  switch (role) {
    case 'student':
      return 'aluno';
    case 'teacher':
      return 'professor';
    case 'admin':
      return 'administrador';
    default:
      return 'aluno';
  }
}