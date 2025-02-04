export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
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

export const rolePermissions = {
  aluno: {
    allowedRoutes: [
      '/dashboard/home/alunos',
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
      '/dashboard/home/professores',
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

export function getUserRole(user: User): 'aluno' | 'professor' | 'administrador' {
  if (user.is_superuser) {
    return 'administrador';
  }
  if (user.teacher) {
    return 'professor';
  }
  if (user.student) {
    return 'aluno';
  }
  return 'aluno'; 
}