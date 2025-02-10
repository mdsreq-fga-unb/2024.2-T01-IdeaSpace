'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, School, GraduationCap, BookOpen } from 'lucide-react';
import { fetchStatistics } from '@/services/statistcs';
import { useToast } from '@/hooks/use-toast';

export default function DashboardAdminPage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    students_count: 0,
    schools_count: 0,
    classrooms_count: 0,
    questions_count: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await fetchStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as estatísticas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total de Alunos',
      value: statistics.students_count.toLocaleString(),
      icon: Users,
      description: 'alunos ativos no sistema',
    },
    {
      title: 'Escolas Cadastradas',
      value: statistics.schools_count.toLocaleString(),
      icon: School,
      description: 'escolas participantes',
    },
    {
      title: 'Turmas Ativas',
      value: statistics.classrooms_count.toLocaleString(),
      icon: GraduationCap,
      description: 'turmas em andamento',
    },
    {
      title: 'Banco de Questões',
      value: statistics.questions_count.toLocaleString(),
      icon: BookOpen,
      description: 'questões disponíveis',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header com título e descrição */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Painel Geral</h1>
        <p className="text-muted-foreground">
          Visão geral das estatísticas do sistema
        </p>
      </div>

      {/* Grid de cards com estatísticas */}
      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {loading ? (
                      <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}