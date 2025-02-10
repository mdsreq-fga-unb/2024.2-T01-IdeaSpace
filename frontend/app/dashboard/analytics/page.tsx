'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchQuestionnaires, 
  getQuestionnaire, 
  getQuestionnaireAllResults,
  getQuestionnaireStudentResults,
  getClassroomStatistics 
} from '@/services/questionnaire';
import { fetchClassrooms, getClassroomWithUsers } from '@/services/classrooms';
import { generatePDF } from '@/lib/utils/pdf';

export default function AnalyticsPage() {
  const [selectedEscola, setSelectedEscola] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedQuestionario, setSelectedQuestionario] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('all');
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [questionnaireDetails, setQuestionnaireDetails] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [classroomStats, setClassroomStats] = useState<any>(null);
  const [studentResultsError, setStudentResultsError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();
  const performanceChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadClassrooms() {
      try {
        const data = await fetchClassrooms();
        setClassrooms(data);
      } catch (error) {
        console.error(error);
        toast({ title: 'Erro', description: 'Não foi possível carregar as turmas', variant: 'destructive' });
      }
    }
    loadClassrooms();
  }, [toast]);

  const schools = useMemo(() => {
    return Array.from(new Map(classrooms.map((c) => [c.school.id, c.school])).values());
  }, [classrooms]);

  const filteredClassrooms = useMemo(() => {
    return selectedEscola ? classrooms.filter((c) => c.school.id.toString() === selectedEscola) : classrooms;
  }, [classrooms, selectedEscola]);

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
        console.error(error);
        toast({ title: 'Erro', description: 'Não foi possível carregar os questionários', variant: 'destructive' });
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
        console.error(error);
        toast({ title: 'Erro', description: 'Não foi possível carregar os alunos', variant: 'destructive' });
      }
    };
    loadStudents();
  }, [selectedTurma, toast]);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedQuestionario) return;
      setLoading(true);
      if (selectedAluno !== 'all') setStudentResultsError(null);
      try {
        if (selectedAluno === 'all') {
          const data = await getQuestionnaireAllResults(parseInt(selectedQuestionario));
          setResults(data);
        } else {
          const data = await getQuestionnaireStudentResults(
            parseInt(selectedQuestionario),
            parseInt(selectedAluno)
          );
          setResults({ [selectedAluno]: data });
        }
        const questionnaireData = await getQuestionnaire(parseInt(selectedQuestionario));
        setQuestionnaireDetails(questionnaireData);
      } catch (error) {
        console.error(error);
        if (selectedAluno !== 'all') {
          setStudentResultsError("Esse usuário não possui o questionário selecionado respondido");
          toast({ title: 'Erro', description: 'Não foi possível carregar os resultados do aluno', variant: 'destructive' });
        } else {
          toast({ title: 'Erro', description: 'Não foi possível carregar os resultados', variant: 'destructive' });
        }
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [selectedQuestionario, selectedAluno, toast]);

  useEffect(() => {
    const loadClassroomStats = async () => {
      if (!selectedTurma) return;
      try {
        const data = await getClassroomStatistics(parseInt(selectedTurma));
        setClassroomStats(data);
      } catch (error) {
        console.error(error);
        toast({ title: 'Erro', description: 'Não foi possível carregar as estatísticas da turma', variant: 'destructive' });
      }
    };
    loadClassroomStats();
  }, [selectedTurma, toast]);

  const handleDownloadPDF = async () => {
    if (!questionnaireDetails) return;
    const element = performanceChartRef.current;
    if (!element) return;
    await generatePDF([element], `Análise - Questionário #${selectedQuestionario}`);
  };

  const chartData = selectedQuestionario && results
    ? ((Object.values(results)[0] as any).result as any[]).map((q: any, index: number) => ({
        questao: `Questão ${index + 1}`,
        acertos: selectedAluno === 'all'
          ? Object.values(results).reduce(
              (acc: number, student: any) => acc + (student.result[index]?.is_correct ? 1 : 0),
              0
            )
          : (results[selectedAluno]?.result[index]?.is_correct ? 1 : 0),
        erros: selectedAluno === 'all'
          ? Object.values(results).reduce(
              (acc: number, student: any) => acc + (student.result[index]?.is_correct ? 0 : 1),
              0
            )
          : (results[selectedAluno]?.result[index]?.is_correct ? 0 : 1),
      }))
    : [];

  const chartConfig = {
    xAxis: { axisLine: true, tickLine: true, padding: { left: 20, right: 20 } },
    yAxis: { axisLine: true, tickLine: true, padding: { top: 20, bottom: 20 } },
    tooltip: {
      contentStyle: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      labelStyle: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Análise de Resultados</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Select
          value={selectedEscola}
          onValueChange={(value) => {
            setSelectedEscola(value);
            setSelectedTurma('');
            setSelectedQuestionario('');
            setSelectedAluno('all');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Escola" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school: any) => (
              <SelectItem key={school.id} value={school.id.toString()}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedTurma}
          onValueChange={(value) => {
            setSelectedTurma(value);
            setSelectedQuestionario('');
            setSelectedAluno('all');
          }}
          disabled={!selectedEscola}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedEscola ? 'Selecionar Turma' : 'Selecione uma escola primeiro'} />
          </SelectTrigger>
          <SelectContent>
            {filteredClassrooms.map((classroom: any) => (
              <SelectItem key={classroom.id} value={classroom.id.toString()}>
                {classroom.name} - {classroom.school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedQuestionario}
          onValueChange={(value) => {
            setSelectedQuestionario(value);
            setSelectedAluno('all');
          }}
          disabled={!selectedTurma}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedTurma ? 'Selecionar Questionário' : 'Selecione uma turma primeiro'} />
          </SelectTrigger>
          <SelectContent>
            {questionnaires.map((questionnaire: any) => (
              <SelectItem key={questionnaire.id} value={questionnaire.id.toString()}>
                Questionário #{questionnaire.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedAluno} onValueChange={setSelectedAluno} disabled={!selectedQuestionario}>
          <SelectTrigger>
            <SelectValue placeholder={selectedQuestionario ? 'Selecionar Aluno' : 'Selecione um questionário primeiro'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os alunos</SelectItem>
            {students.map((student: any) => (
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
            <div>
              <h2 className="text-xl font-semibold">Questionário #{selectedQuestionario}</h2>
              {selectedAluno !== 'all' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Visualizando resultados de:{' '}
                  {students.find((s: any) => s.user_id.toString() === selectedAluno)?.user.full_name ||
                    students.find((s: any) => s.user_id.toString() === selectedAluno)?.user.username}
                </p>
              )}
            </div>
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">Duração</CardTitle>
                        <p className="text-base">{questionnaireDetails?.duration} minutos</p>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total de Questões</CardTitle>
                        <p className="text-base">{questionnaireDetails?.questions?.length || 0} questões</p>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                        <p className="text-base">{questionnaireDetails?.closed ? 'Encerrado' : 'Em andamento'}</p>
                      </div>
                      <div className="border-t pt-4">
                        <CardTitle className="font-medium mb-4">Questões</CardTitle>
                        <div className="space-y-6">
                          {questionnaireDetails?.questions?.map((question: any, index: number) => (
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
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium">{String.fromCharCode(65 + altIndex)}</span>
                                        <span>{option.text}</span>
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
          <div className="grid gap-6 md:grid-cols-2">
            {selectedAluno !== 'all' && studentResultsError ? (
              <Card className="p-8">
                <div className="flex items-center justify-center h-40">
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
                        <Legend />#3b82f6
                        <Bar dataKey="acertos" name="Acertos" fill={theme === 'dark' ? '#3b82f6' : '#3b82f6'} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="erros" name="Erros" fill={theme === 'dark' ? '#ec4899' : '#ec4899'} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas da Turma</CardTitle>
              </CardHeader>
              <CardContent>
                {classroomStats ? (
                  <div className="flex flex-col md:flex-row h-full pt-8">
                    <div className="flex flex-col flex-1 space-y-8">
                      <div className="flex flex-col items-center">
                        <p className="text-base text-muted-foreground">Total de Questões</p>
                        <p className="text-3xl font-bold">{classroomStats.total_questions}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-base text-muted-foreground">Total de Questionários</p>
                        <p className="text-3xl font-bold">{classroomStats.total_questionnaires}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-base text-muted-foreground">Alunos com Resultados</p>
                        <p className="text-3xl font-bold">{classroomStats.students_with_results}</p>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 space-y-8 md:mt-0 mt-8">
                      <div className="flex flex-col items-center">
                        <p className="text-base text-muted-foreground">Acertos</p>
                        <p className="text-3xl font-bold">{classroomStats.correct_answers}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-base text-muted-foreground">Total de Alunos</p>
                        <p className="text-3xl font-bold">{classroomStats.total_students}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Nenhuma estatística disponível</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Selecione uma turma e um questionário</h3>
            <p className="text-sm text-muted-foreground">
              Escolha uma turma e um questionário para visualizar as análises de desempenho
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
