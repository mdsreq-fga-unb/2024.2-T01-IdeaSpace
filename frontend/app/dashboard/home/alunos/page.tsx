'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Sparkles, Target } from 'lucide-react';
import Image from 'next/image';

export default function DashboardAlunoPage() {
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
