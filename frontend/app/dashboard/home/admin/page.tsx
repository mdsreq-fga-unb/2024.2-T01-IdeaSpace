'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, School, GraduationCap, BookOpen } from 'lucide-react';

export default function DashboardAdminPage() {
  const stats = [
    {
      title: 'Total de Alunos',
      value: '2,850',
      icon: Users,
      trend: '+12%',
    },
    {
      title: 'Escolas Cadastradas',
      value: '45',
      icon: School,
      trend: '+3%',
    },
    {
      title: 'Turmas Cadastradas',
      value: '120',
      icon: GraduationCap,
      trend: '+8%',
    },
    {
      title: 'Questões',
      value: '1,250',
      icon: BookOpen,
      trend: '+25%',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel Geral</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-500 mt-1">
                  {stat.trend} desde o último mês
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
