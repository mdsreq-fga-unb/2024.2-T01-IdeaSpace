'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, Users, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { fetchQuestionnaires } from '@/services/questionnaire';

export default function QuizListingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.student?.classroom?.id) {
      loadQuestionnaires();
    }
  }, [user]);

  const loadQuestionnaires = async () => {
    if (!user?.student?.classroom?.id) return;
    
    setLoading(true);
    try {
      const data = await fetchQuestionnaires(user.student.classroom.id);
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

  const availableQuestionnaires = filteredQuestionnaires.filter(q => !q.closed && q.released);
  const closedQuestionnaires = filteredQuestionnaires.filter(q => q.closed);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4">
          <div className="flex h-16 items-center">
            <MainNav />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
                  <ArrowLeft className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
                Questionários
              </h1>
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
            </div>

            {!user?.student?.classroom ? (
              <Card className="p-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Nenhuma turma encontrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Você precisa estar vinculado a uma turma para ver os questionários
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
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">
                            Questionário #{questionnaire.id}
                          </CardTitle>
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
                            <div className="flex">
                              <Link href={`/quiz/${questionnaire.id}`} className="w-full">
                                <Button className="w-full gap-2 bg-pink-600 hover:bg-pink-700">
                                  <ArrowRight className="h-4 w-4" />
                                  Iniciar
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {availableQuestionnaires.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        Nenhum questionário disponível no momento
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="closed" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {closedQuestionnaires.map((questionnaire) => (
                      <Card key={questionnaire.id}>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">
                            Questionário #{questionnaire.id}
                          </CardTitle>
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
                            <div className="flex justify-center">
                              <Link href={`/quiz/${questionnaire.id}/results`} className="w-full">
                                <Button variant="outline" className="w-full gap-2">
                                  <Eye className="h-4 w-4" />
                                  Ver Resultados
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {closedQuestionnaires.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        Nenhum questionário encerrado
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
