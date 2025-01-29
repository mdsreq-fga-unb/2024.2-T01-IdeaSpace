'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle2, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { generatePDF } from '@/lib/utils/pdf';

export default function AnalyticsPage() {
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedRegiao, setSelectedRegiao] = useState('');
  const [selectedEscola, setSelectedEscola] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('');
  const [selectedQuestionario, setSelectedQuestionario] = useState('');
  const { theme } = useTheme();

  const performanceChartRef = useRef<HTMLDivElement>(null);
  const turmasChartRef = useRef<HTMLDivElement>(null);
  const detailsChartRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual data from your backend
  const turmas = ['Turma A', 'Turma B', 'Turma C'];
  const regioes = ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'];
  const escolas = ['Escola Municipal João Paulo', 'Escola Estadual Maria Silva', 'Colégio Pedro II'];
  const alunos = ['Ana Silva', 'Bruno Santos', 'Carla Oliveira'];
  const questionarios = [
    {
      id: 1,
      titulo: 'Matemática Básica',
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
  ];

  const selectedQuestionarioData = questionarios.find(q => q.titulo === selectedQuestionario);
  
  const questionsData = selectedQuestionarioData?.questoes.map((q, index) => ({
    questao: `Questão ${index + 1}`,
    acertos: q.estatisticas.acertos,
    erros: q.estatisticas.erros,
  })) || [];

  const performanceData = [
    { 
      turma: 'Turma A',
      mediaAcertos: 85,
      totalAlunos: 32,
    },
    { 
      turma: 'Turma B',
      mediaAcertos: 78,
      totalAlunos: 28,
    },
    { 
      turma: 'Turma C',
      mediaAcertos: 92,
      totalAlunos: 30,
    },
  ];

  const handleDownloadPDF = async () => {
    if (!selectedQuestionarioData) return;
    
    const elements = [
      performanceChartRef.current,
      turmasChartRef.current,
      detailsChartRef.current,
    ].filter(Boolean) as HTMLElement[];

    await generatePDF(elements, `Análise - ${selectedQuestionarioData.titulo}`);
  };

  // Chart configuration
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

  // Chart colors
  const chartColors = {
    pink: '#ec4899',
    blue: '#3b82f6',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Análise de Resultados</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Select value={selectedQuestionario} onValueChange={setSelectedQuestionario}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Questionário" />
          </SelectTrigger>
          <SelectContent>
            {questionarios.map(questionario => (
              <SelectItem key={questionario.id} value={questionario.titulo}>
                {questionario.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTurma} onValueChange={setSelectedTurma}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Turma" />
          </SelectTrigger>
          <SelectContent>
            {turmas.map(turma => (
              <SelectItem key={turma} value={turma}>{turma}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Região" />
          </SelectTrigger>
          <SelectContent>
            {regioes.map(regiao => (
              <SelectItem key={regiao} value={regiao}>{regiao}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedEscola} onValueChange={setSelectedEscola}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Escola" />
          </SelectTrigger>
          <SelectContent>
            {escolas.map(escola => (
              <SelectItem key={escola} value={escola}>{escola}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAluno} onValueChange={setSelectedAluno}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar Aluno" />
          </SelectTrigger>
          <SelectContent>
            {alunos.map(aluno => (
              <SelectItem key={aluno} value={aluno}>{aluno}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedQuestionario ? (
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{selectedQuestionario}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleDownloadPDF}
              >
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
                    <DialogTitle>{selectedQuestionario}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[600px]">
                    <div className="space-y-6 p-4">
                      {selectedQuestionarioData?.questoes.map((questao, index) => (
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Questão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]" ref={performanceChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={questionsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="questao"
                        {...chartConfig.xAxis}
                      />
                      <YAxis
                        {...chartConfig.yAxis}
                      />
                      <Tooltip
                        {...chartConfig.tooltip}
                      />
                      <Legend />
                      <Bar
                        dataKey="acertos"
                        name="Acertos"
                        fill={chartColors.pink}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="erros"
                        name="Erros"
                        fill={chartColors.blue}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Média de Acertos por Turma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]" ref={turmasChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="turma"
                        {...chartConfig.xAxis}
                      />
                      <YAxis
                        {...chartConfig.yAxis}
                      />
                      <Tooltip
                        {...chartConfig.tooltip}
                      />
                      <Bar
                        dataKey="mediaAcertos"
                        name="Média de Acertos (%)"
                        fill={chartColors.pink}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Questão</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]" ref={detailsChartRef}>
                <div className="space-y-4">
                  {selectedQuestionarioData?.questoes.map((questao, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-medium">Questão {index + 1}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tempo médio: {questao.estatisticas.tempoMedio}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {questao.estatisticas.acertos}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          taxa de acerto
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Selecione um questionário</h3>
            <p className="text-sm text-muted-foreground">
              Escolha um questionário para visualizar as análises de desempenho
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}