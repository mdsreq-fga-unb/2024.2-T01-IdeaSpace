'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, TrendingUp, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getStudentResults } from '@/services/students';
import { fetchQuestionnaires } from '@/services/questionnaire';
import Link from 'next/link';

// Tipagem para um questionário, conforme resposta da API
interface Questionnaire {
  id: number;
  questions: {
    id: number;
    text: string;
    category_id: number;
    difficulty: string;
    category: { name: string };
    created_at: string;
    updated_at: string;
    options: { id: number; text: string }[];
  }[];
  classroom_id: number;
  duration: number;
  released: boolean;
  closed: boolean;
}

// Tipagem para o resultado individual do estudante
interface StudentResult {
  total_questions: number;
  correct_answers: number;
  questionnaire_id?: number; // pode vir undefined
  result: {
    question_id: number;
    question_text: string;
    options: { id: number; text: string; is_answer: boolean }[];
    student_answer: number | null;
    correct_answer: number;
    is_correct: boolean;
  }[];
}

// Tipagem para o conjunto dos resultados do estudante
interface StudentResults {
  global_questions_amount: number;
  global_correct_answers: number;
  total_questionnaires: number;
  results: StudentResult[];
}

export default function DesempenhoPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<StudentResults | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadResults = async (userId: number, classroomId: number) => {
      setLoading(true);
      try {
        // Obtém os resultados do estudante (usando o ID do usuário)
        const data: StudentResults = await getStudentResults(userId);

        // Obtém todos os questionários da sala
        const questionnaires: Questionnaire[] = await fetchQuestionnaires(classroomId);

        // Para cada resultado, tenta associar o ID correto do questionário
        const updatedResults = data.results.map((result: StudentResult, idx: number) => {
          let newQuestionnaireId = result.questionnaire_id;
          const questionnaireFound = questionnaires.find(
            (q) => q.id === result.questionnaire_id
          );
          if (!questionnaireFound && questionnaires[idx]) {
            newQuestionnaireId = questionnaires[idx].id;
          } else if (questionnaireFound) {
            newQuestionnaireId = questionnaireFound.id;
          }
          return {
            ...result,
            questionnaire_id: newQuestionnaireId,
          };
        });

        // Filtra para manter somente os questionários fechados (closed)
        const filteredResults = updatedResults.filter((result: StudentResult) => {
          const q = questionnaires.find((q) => q.id === result.questionnaire_id);
          return q?.closed;
        });

        setResults({
          ...data,
          results: filteredResults,
        });
      } catch (error) {
        console.error('Error loading results:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os resultados',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    // Verifica se o objeto user e a sala (classroom) estão definidos
    if (user?.id && user?.student?.classroom?.id) {
      loadResults(user.id, user.student.classroom.id);
    }
  }, [user, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meu Desempenho</h1>
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meu Desempenho</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p>Nenhum resultado encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Questões Respondidas',
      value: results.global_questions_amount.toString(),
      icon: GraduationCap,
      trend: `${results.total_questionnaires} questionários`,
      color: 'text-green-500',
    },
    {
      title: 'Questões Corretas',
      value: results.global_correct_answers.toString(),
      icon: Target,
      trend: `${Math.round((results.global_correct_answers / results.global_questions_amount) * 100)}% de acerto`,
      color: 'text-blue-500',
    },
    {
      title: 'Total de Questionários',
      value: results.total_questionnaires.toString(),
      icon: TrendingUp,
      trend: 'questionários realizados',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Desempenho</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.color} mt-1`}>{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Questionários</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {results.results.map((result: StudentResult, index: number) => (
                <Link
                  key={index}
                  href={`/quiz/${result.questionnaire_id}/results`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium">
                        Questionário #{result.questionnaire_id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.correct_answers} questões corretas de {result.total_questions}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pink-600">
                        {result.correct_answers}/{result.total_questions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((result.correct_answers / result.total_questions) * 100)}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
