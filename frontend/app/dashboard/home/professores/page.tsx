'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Target } from 'lucide-react';
import Image from 'next/image';

export default function DashboardProfessorPage() {
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
