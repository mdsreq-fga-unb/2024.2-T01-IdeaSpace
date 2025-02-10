'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Clock, Users, Eye, Plus, Lock } from 'lucide-react';
import { CreateQuizDialog } from './components/create-quiz-dialog';
import { ViewQuestionnaireDialog } from './components/view-questionnaire-dialog';
import { ReleaseQuestionnaireDialog } from './components/release-questionnaire-dialog';
import { CloseQuestionnaireDialog } from './components/close-questionnaire-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { fetchQuestionnaires } from '@/services/questionnaire';

export default function QuestionariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');
  const [loading, setLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const teacherClassrooms = user?.teacher?.classrooms || [];

  useEffect(() => {
    if (selectedTurma) {
      loadQuestionnaires();
    }
  }, [selectedTurma]);

  const loadQuestionnaires = async () => {
    if (!selectedTurma) return;
    
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestionnaires = questionnaires.filter(questionnaire =>
    questionnaire.questions.some((q: any) =>
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const availableQuestionnaires = filteredQuestionnaires.filter(q => !q.closed);
  const closedQuestionnaires = filteredQuestionnaires.filter(q => q.closed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Questionários</h1>
        <CreateQuizDialog onSuccess={loadQuestionnaires} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar questionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedTurma} onValueChange={setSelectedTurma}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Selecionar turma" />
          </SelectTrigger>
          <SelectContent>
            {teacherClassrooms.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id.toString()}>
                {classroom.name} - {classroom.school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedTurma ? (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Selecione uma turma</h3>
            <p className="text-sm text-muted-foreground">
              Escolha uma turma para visualizar os questionários
            </p>
          </div>
        </Card>
      ) : loading ? (
        <div className="text-center py-8">
          <p>Carregando questionários...</p>
        </div>
      ) : (
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            <TabsTrigger value="closed">Encerrados</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableQuestionnaires.map((questionnaire) => (
                <Card key={questionnaire.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Questionário #{questionnaire.id}
                    </CardTitle>
                    <Badge className={questionnaire.released ? 'bg-green-500' : 'bg-yellow-500'}>
                      {questionnaire.released ? 'Liberado' : 'Não liberado'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{questionnaire.duration}min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{questionnaire.questions.length} questões</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ViewQuestionnaireDialog
                          questionnaireId={questionnaire.id}
                          trigger={
                            <Button variant="outline" className="w-full gap-2">
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Button>
                          }
                        />
                        <ReleaseQuestionnaireDialog
                          questionnaireId={questionnaire.id}
                          isReleased={questionnaire.released}
                          onSuccess={loadQuestionnaires}
                          trigger={
                            <Button className="w-full gap-2 bg-pink-600 hover:bg-pink-700">
                              <Send className="h-4 w-4" />
                              {questionnaire.released ? 'Recolher' : 'Liberar'}
                            </Button>
                          }
                        />
                      </div>
                      <CloseQuestionnaireDialog
                        questionnaireId={questionnaire.id}
                        onSuccess={loadQuestionnaires}
                        trigger={
                          <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Lock className="h-4 w-4" />
                            Encerrar
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {closedQuestionnaires.map((questionnaire) => (
                <Card key={questionnaire.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Questionário #{questionnaire.id}
                    </CardTitle>
                    <Badge variant="secondary">Encerrado</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{questionnaire.duration}min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{questionnaire.questions.length} questões</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ViewQuestionnaireDialog
                          questionnaireId={questionnaire.id}
                          trigger={
                            <Button variant="outline" className="w-full gap-2">
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Button>
                          }
                        />
                        <CloseQuestionnaireDialog
                          questionnaireId={questionnaire.id}
                          isClosed={true}
                          onSuccess={loadQuestionnaires}
                          trigger={
                            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                              <Lock className="h-4 w-4" />
                              Reabrir
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}