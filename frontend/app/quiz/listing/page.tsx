'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock, Users, ArrowRight, ArrowLeft, Eye, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function QuizListingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');

  // Mock data - replace with actual data from your backend
  const questionariosDisponiveis = [
    {
      id: 1,
      titulo: 'Matemática Básica',
      materia: 'Matemática',
      duracao: '45min',
      status: 'disponível',
      totalQuestoes: 10,
      professor: 'Maria Silva',
    },
    {
      id: 2,
      titulo: 'História do Brasil',
      materia: 'História',
      duracao: '30min',
      status: 'disponível',
      totalQuestoes: 8,
      professor: 'João Santos',
    },
    {
      id: 3,
      titulo: 'Geografia Mundial',
      materia: 'Geografia',
      duracao: '40min',
      status: 'agendado',
      totalQuestoes: 12,
      professor: 'Ana Oliveira',
    },
  ];

  const questionariosEncerrados = [
    {
      id: 4,
      titulo: 'Física Básica',
      materia: 'Física',
      duracao: '50min',
      totalQuestoes: 15,
      professor: 'Carlos Eduardo',
      dataRealizacao: '2024-03-20',
      nota: 85,
      questoes: [
        {
          pergunta: 'O que é velocidade?',
          alternativas: [
            'Distância percorrida',
            'Distância percorrida por tempo',
            'Tempo gasto no percurso',
            'Força aplicada no movimento'
          ],
          respostaCorreta: 1,
          respostaAluno: 1,
        },
        {
          pergunta: 'Qual a unidade de medida de força no SI?',
          alternativas: [
            'Metro',
            'Quilograma',
            'Newton',
            'Joule'
          ],
          respostaCorreta: 2,
          respostaAluno: 3,
        },
      ],
    },
    {
      id: 5,
      titulo: 'Química Orgânica',
      materia: 'Química',
      duracao: '35min',
      totalQuestoes: 10,
      professor: 'Patricia Santos',
      dataRealizacao: '2024-03-18',
      nota: 90,
      questoes: [
        {
          pergunta: 'O que são hidrocarbonetos?',
          alternativas: [
            'Compostos de H e O',
            'Compostos de C e H',
            'Compostos de C e O',
            'Compostos de H e N'
          ],
          respostaCorreta: 1,
          respostaAluno: 1,
        },
      ],
    },
  ];

  const materias = [...new Set([
    ...questionariosDisponiveis.map(q => q.materia),
    ...questionariosEncerrados.map(q => q.materia)
  ])];

  const filteredDisponiveis = questionariosDisponiveis.filter(questionario => 
    questionario.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedMateria || questionario.materia === selectedMateria)
  );

  const filteredEncerrados = questionariosEncerrados.filter(questionario => 
    questionario.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedMateria || questionario.materia === selectedMateria)
  );

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
              <Select value={selectedMateria} onValueChange={setSelectedMateria}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Filtrar por matéria" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map(materia => (
                    <SelectItem key={materia} value={materia}>{materia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="disponiveis" className="space-y-4">
              <TabsList>
                <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
                <TabsTrigger value="encerrados">Encerrados</TabsTrigger>
              </TabsList>

              <TabsContent value="disponiveis" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDisponiveis.map((questionario) => (
                    <Card key={questionario.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">{questionario.titulo}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{questionario.duracao}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{questionario.totalQuestoes} questões</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Matéria: {questionario.materia}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Professor: {questionario.professor}
                            </p>
                          </div>
                          <Link href={`/quiz?id=${questionario.id}`}>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700">
                              Iniciar Questionário
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="encerrados" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEncerrados.map((questionario) => (
                    <Card key={questionario.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">{questionario.titulo}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{questionario.duracao}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{questionario.totalQuestoes} questões</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Matéria: {questionario.materia}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Professor: {questionario.professor}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Data: {new Date(questionario.dataRealizacao).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-lg font-semibold text-pink-600">
                              Nota: {questionario.nota}%
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full" variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Revisar Questionário
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Revisão - {questionario.titulo}</DialogTitle>
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
                                                  ? 'border-green-200 bg-green-50'
                                                  : altIndex === questao.respostaAluno && questao.respostaAluno !== questao.respostaCorreta
                                                  ? 'border-red-200 bg-red-50'
                                                  : 'border-gray-200'
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
                                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                )}
                                                {altIndex === questao.respostaAluno && questao.respostaAluno !== questao.respostaCorreta && (
                                                  <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}