'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Sparkles, BookOpen, Target, Users, School, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();

  // Welcome page for students
  if (user?.role === 'aluno') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
            Bem-vindo à Jornada Espacial do Conhecimento
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Embarque em uma aventura intergaláctica de aprendizado. Explore questionários interativos e alcance as estrelas do conhecimento.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Missões de Aprendizado</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Embarque em missões educacionais através de questionários interativos que testarão seus conhecimentos.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Conquistas Estelares</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Acompanhe seu progresso e veja suas conquistas brilharem como estrelas no universo do conhecimento.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Exploração Contínua</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Explore o universo do conhecimento no seu próprio ritmo, como um verdadeiro astronauta do saber.
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
              alt="Galáxia espiral"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80"
              alt="Planeta Terra visto do espaço"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  // Welcome page for teachers
  if (user?.role === 'professor') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
            Centro de Comando Espacial
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Como comandante desta estação espacial do conhecimento, você tem o poder de guiar seus alunos através do vasto universo do aprendizado.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Tripulação Estelar</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Gerencie sua tripulação de estudantes e guie-os em sua jornada pelo conhecimento.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Missões Educacionais</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Lance questionários como missões espaciais para explorar novos horizontes do conhecimento.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Navegação Estelar</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Monitore o progresso de sua tripulação através de análises detalhadas de desempenho.
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80"
              alt="Estação espacial"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?auto=format&fit=crop&q=80"
              alt="Nebulosa colorida"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
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