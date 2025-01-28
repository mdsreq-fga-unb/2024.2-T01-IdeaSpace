'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Clock, Users, Eye, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateQuizDialog } from './components/create-quiz-dialog';

export default function QuestionariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('');

  // Mock data - replace with actual data from your backend
  const questionarios = [
    {
      id: 1,
      titulo: 'Matemática Básica',
      tema: 'Matemática',
      turmas: ['Turma A', 'Turma B'],
      duracao: '45min',
      status: 'disponível',
      totalQuestoes: 10,
      professor: 'Maria Silva',
      questoes: [
        {
          pergunta: 'Quanto é 2 + 2?',
          alternativas: ['3', '4', '5', '6'],
          respostaCorreta: 1,
          estatisticas: {
            acertos: 85,
            erros: 15,
            tempoMedio: '45s',
            distribuicaoRespostas: [10, 85, 3, 2],
          },
        },
        {
          pergunta: 'Qual é a raiz quadrada de 16?',
          alternativas: ['2', '4', '6', '8'],
          respostaCorreta: 1,
          estatisticas: {
            acertos: 78,
            erros: 22,
            tempoMedio: '60s',
            distribuicaoRespostas: [15, 78, 5, 2],
          },
        },
      ],
    },
    {
      id: 2,
      titulo: 'História do Brasil',
      tema: 'História',
      turmas: ['Turma C'],
      duracao: '30min',
      status: 'disponível',
      totalQuestoes: 8,
      professor: 'João Santos',
      questoes: [
        {
          pergunta: 'Em que ano o Brasil foi descoberto?',
          alternativas: ['1498', '1500', '1502', '1504'],
          respostaCorreta: 1,
          estatisticas: {
            acertos: 90,
            erros: 10,
            tempoMedio: '30s',
            distribuicaoRespostas: [5, 90, 3, 2],
          },
        },
      ],
    },
    {
      id: 3,
      titulo: 'Geografia Mundial',
      tema: 'Geografia',
      turmas: ['Turma A'],
      duracao: '40min',
      status: 'encerrado',
      totalQuestoes: 12,
      professor: 'Ana Oliveira',
      questoes: [
        {
          pergunta: 'Qual é o maior continente?',
          alternativas: ['América', 'África', 'Ásia', 'Europa'],
          respostaCorreta: 2,
          estatisticas: {
            acertos: 75,
            erros: 25,
            tempoMedio: '40s',
            distribuicaoRespostas: [10, 10, 75, 5],
          },
        },
      ],
    },
  ];

  const turmas = [...new Set(questionarios.flatMap(q => q.turmas))];

  const filteredQuestionarios = questionarios.filter(questionario => 
    questionario.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedTurma || questionario.turmas.includes(selectedTurma))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponível':
        return 'bg-green-500';
      case 'encerrado':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Questionários</h1>
        <CreateQuizDialog />
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
            <SelectValue placeholder="Filtrar por turma" />
          </SelectTrigger>
          <SelectContent>
            {turmas.map(turma => (
              <SelectItem key={turma} value={turma}>{turma}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="disponível" className="space-y-4">
        <TabsList>
          <TabsTrigger value="disponível">Disponíveis</TabsTrigger>
          <TabsTrigger value="encerrado">Encerrados</TabsTrigger>
        </TabsList>

        {['disponível', 'encerrado'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuestionarios
                .filter(q => q.status === status)
                .map((questionario) => (
                  <Card key={questionario.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-semibold">{questionario.titulo}</CardTitle>
                      <Badge className={getStatusColor(questionario.status)}>
                        {questionario.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{questionario.duracao}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{questionario.totalQuestoes} questões</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {questionario.turmas.map((turma) => (
                            <Badge key={turma} variant="outline">
                              {turma}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full gap-2">
                                <Eye className="h-4 w-4" />
                                Visualizar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>{questionario.titulo}</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="max-h-[600px]">
                                <div className="space-y-6 p-4">
                                  {questionario.questoes.map((questao, index) => (
                                    <Card key={index}>
                                      <CardHeader>
                                        <CardTitle className="text-lg">
                                          Questão {index + 1}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <p className="font-medium">{questao.pergunta}</p>
                                        <div className="grid gap-3">
                                          {questao.alternativas.map((alternativa, altIndex) => (
                                            <div
                                              key={altIndex}
                                              className={`p-3 rounded-lg border ${
                                                altIndex === questao.respostaCorreta
                                                  ? 'border-green-500/20 bg-green-500/10 dark:border-green-500/30 dark:bg-green-500/20'
                                                  : 'border-gray-200 dark:border-gray-800'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                  <span className="font-medium">
                                                    {String.fromCharCode(65 + altIndex)}
                                                  </span>
                                                  <span>{alternativa}</span>
                                                </div>
                                                {altIndex === questao.respostaCorreta && (
                                                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        {questionario.status === 'encerrado' && (
                                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-2">
                                            <h4 className="font-medium">Estatísticas</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                  {questao.estatisticas.acertos}%
                                                </p>
                                              </div>
                                              <div>
                                                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                                                <p className="text-lg font-semibold">
                                                  {questao.estatisticas.tempoMedio}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          {status === 'disponível' && (
                            <Button className="w-full bg-pink-600 hover:bg-pink-700">
                              <Send className="mr-2 h-4 w-4" />
                              Liberar para Turma
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}