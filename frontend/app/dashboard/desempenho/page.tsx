'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, Clock, TrendingUp, GraduationCap } from 'lucide-react';

export default function DesempenhoPage() {
  // Mock data - replace with actual data from your backend
  const stats = [
    {
      title: 'Média Geral',
      value: '8.5',
      icon: GraduationCap,
      trend: '+0.5',
      color: 'text-green-500'
    },
    {
      title: 'Taxa de Acerto',
      value: '75%',
      icon: Target,
      trend: '+5%',
      color: 'text-blue-500'
    },
    {
      title: 'Tempo Médio',
      value: '8.5min',
      icon: Clock,
      trend: '-30s',
      color: 'text-yellow-500'
    },
    {
      title: 'Questionários',
      value: '12',
      icon: TrendingUp,
      trend: '+2',
      color: 'text-purple-500'
    },
  ];

  const recentQuizzes = [
    { name: 'Matemática Básica', score: 90, date: '2024-03-15', total: 100 },
    { name: 'História do Brasil', score: 85, date: '2024-03-14', total: 100 },
    { name: 'Geografia Mundial', score: 75, date: '2024-03-13', total: 100 },
    { name: 'Ciências Naturais', score: 95, date: '2024-03-12', total: 100 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Desempenho</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.color} mt-1`}>
                  {stat.trend} último mês
                </p>
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
              {recentQuizzes.map((quiz, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{quiz.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quiz.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600">
                      {quiz.score}/{quiz.total}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((quiz.score / quiz.total) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}