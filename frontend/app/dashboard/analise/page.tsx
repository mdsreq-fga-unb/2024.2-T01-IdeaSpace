'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Eye, Download, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getQuestionnaireAllResults, getQuestionnaireStudentResults, fetchQuestionnaires, getQuestionnaire } from '@/services/questionnaire';
import { getClassroomWithUsers } from '@/services/classrooms';
import { generatePDF } from '@/lib/utils/pdf';

interface QuestionResult {
  question_id: number;
  question_text: string;
  options: Array<{
    id: number;
    text: string;
    is_answer: boolean;
  }>;
  student_answer: number | null;
  correct_answer: number;
  is_correct: boolean;
}

interface StudentResult {
  total_questions: number;
  correct_answers: number;
  result: QuestionResult[];
}

export default function AnalisePage() {
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedQuestionario, setSelectedQuestionario] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, StudentResult>>({});
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedQuestionnaireDetails, setSelectedQuestionnaireDetails] = useState<any>(null);
  const [studentResultsError, setStudentResultsError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  const performanceChartRef = useRef<HTMLDivElement>(null);

  const classrooms = user?.teacher?.classrooms || [];

  useEffect(() => {
    const loadQuestionnaires = async () => {
      if (!selectedTurma) {
        setQuestionnaires([]);
        return;
      }

      try {
        const data = await fetchQuestionnaires(parseInt(selectedTurma));
        setQuestionnaires(data);
      } catch (error) {
        console.error('Error loading questionnaires:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os questionários',
          variant: 'destructive',
        });
      }
    };

    loadQuestionnaires();
  }, [selectedTurma, toast]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedTurma) {
        setStudents([]);
        return;
      }

      try {
        const data = await getClassroomWithUsers(parseInt(selectedTurma));
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error loading students:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os alunos',
          variant: 'destructive',
        });
      }
    };

    loadStudents();
  }, [selectedTurma, toast]);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedQuestionario) return;
      setLoading(true);
      setStudentResultsError(null);
      setResults({});
      try {
        const data = await getQuestionnaireAllResults(parseInt(selectedQuestionario));
        setResults(data);
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

    if (selectedAluno === 'all') {
      loadResults();
    }
  }, [selectedQuestionario, selectedAluno, toast]);

  useEffect(() => {
    let isActive = true; 
    const loadStudentResults = async () => {
      if (!selectedQuestionario || selectedAluno === 'all') return;

      setLoading(true);
      setStudentResultsError(null);
      setResults({});
      try {
        const data = await getQuestionnaireStudentResults(
          parseInt(selectedQuestionario),
          parseInt(selectedAluno)
        );
        if (isActive) {
          setResults({ [selectedAluno]: data });
        }
      } catch (error) {
        if (isActive) {
          console.error('Error loading student results:', error);
          setStudentResultsError('Esse usuário não possui questionários respondidos');
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os resultados do aluno',
            variant: 'destructive',
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (selectedAluno !== 'all') {
      loadStudentResults();
    }

    return () => {
      isActive = false;
    };
  }, [selectedAluno, selectedQuestionario, toast]);

  useEffect(() => {
    const loadQuestionnaireDetails = async () => {
      if (!selectedQuestionario) {
        setSelectedQuestionnaireDetails(null);
        return;
      }

      try {
        const data = await getQuestionnaire(parseInt(selectedQuestionario));
        setSelectedQuestionnaireDetails(data);
      } catch (error) {
        console.error('Error loading questionnaire details:', error);
      }
    };

    loadQuestionnaireDetails();
  }, [selectedQuestionario]);

  useEffect(() => {
    setSelectedQuestionario('');
    setSelectedAluno('all');
    setStudentResultsError(null);
    setResults({});
  }, [selectedTurma]);

  useEffect(() => {
    setSelectedAluno('all');
    setStudentResultsError(null);
    setResults({});
  }, [selectedQuestionario]);

  const chartData =
    selectedQuestionario && results
      ? Object.values(results)[0]?.result.map((q, index) => ({
          questao: `Questão ${index + 1}`,
          acertos: Object.values(results).reduce(
            (acc, student) => acc + (student.result[index]?.is_correct ? 1 : 0),
            0
          ),
          erros: Object.values(results).reduce(
            (acc, student) => acc + (student.result[index]?.is_correct ? 0 : 1),
            0
          ),
        }))
      : [];

  const handleDownloadPDF = async () => {
    if (!selectedQuestionnaireDetails) return;
    const elements = [performanceChartRef.current].filter(Boolean) as HTMLElement[];
    await generatePDF(elements, `Análise - Questionário #${selectedQuestionario}`);
  };

  const chartConfig = {
    xAxis: {
      axisLine: true,
      tickLine: true,
      padding: { left: 20, right: 20 },
    },
    yAxis: {
      axisLine: true,
      tickLine: true,
      padding: { top: 20, bottom: 20 },
    },
    tooltip: {
      contentStyle: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      labelStyle: {
        color: theme === 'dark' ? '#e5e7eb' : '#374151',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Análise de Desempenho</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Select value={selectedTurma} onValueChange={setSelectedTurma}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Turma" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id.toString()}>
                {classroom.name} - {classroom.school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedQuestionario}
          onValueChange={setSelectedQuestionario}
          disabled={!selectedTurma}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={selectedTurma ? 'Selecionar Questionário' : 'Selecione uma turma primeiro'}
            />
          </SelectTrigger>
          <SelectContent>
            {questionnaires.map((questionnaire) => (
              <SelectItem key={questionnaire.id} value={questionnaire.id.toString()}>
                Questionário #{questionnaire.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedAluno}
          onValueChange={setSelectedAluno}
          disabled={!selectedQuestionario}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={selectedQuestionario ? 'Selecionar Aluno' : 'Selecione um questionário primeiro'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os alunos</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.user_id} value={student.user_id.toString()}>
                {student.user.full_name || student.user.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Card className="p-8">
          <div className="text-center">
            <p>Carregando resultados...</p>
          </div>
        </Card>
      ) : selectedQuestionario ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Questionário #{selectedQuestionario}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4" />
                Baixar Relatório
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Ver Questionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Questionário #{selectedQuestionario}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[600px]">
                    <div className="space-y-6 p-4">
                      <div className="grid gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Duração</h4>
                          <p className="text-base">{selectedQuestionnaireDetails?.duration} minutos</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Total de Questões</h4>
                          <p className="text-base">{selectedQuestionnaireDetails?.questions?.length || 0} questões</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                          <p className="text-base">
                            {selectedQuestionnaireDetails?.closed ? 'Encerrado' : 'Em andamento'}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-medium mb-4">Questões</h3>
                        <div className="space-y-6">
                          {selectedQuestionnaireDetails?.questions?.map((question: any, index: number) => (
                            <Card key={question.id}>
                              <CardHeader>
                                <CardTitle className="text-lg">Questão {index + 1}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="font-medium">{question.text}</p>
                                <div className="grid gap-3">
                                  {question.options.map((option: any, altIndex: number) => (
                                    <div
                                      key={option.id}
                                      className={`p-3 rounded-lg border ${
                                        option.is_answer
                                          ? 'border-green-500/20 bg-green-500/10 dark:border-green-500/30 dark:bg-green-500/20'
                                          : 'border-gray-200 dark:border-gray-800'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <span className="font-medium">
                                            {String.fromCharCode(65 + altIndex)}
                                          </span>
                                          <span>{option.text}</span>
                                        </div>
                                        {option.is_answer && (
                                          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {selectedAluno !== 'all' && studentResultsError ? (
            <Card className="p-8">
              <div className="text-center">
                <p className="text-red-500 font-semibold">{studentResultsError}</p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Questão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]" ref={performanceChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="questao" {...chartConfig.xAxis} />
                      <YAxis {...chartConfig.yAxis} />
                      <Tooltip {...chartConfig.tooltip} />
                      <Legend />
                      <Bar
                        dataKey="acertos"
                        name="Acertos"
                        fill={theme === 'dark' ? '#3b82f6' : '#3b82f6'}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="erros"
                        name="Erros"
                        fill={theme === 'dark' ? '#ec4899' : '#ec4899'}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium">Selecione uma turma e um questionário</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Escolha uma turma e um questionário para visualizar as análises de desempenho
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
