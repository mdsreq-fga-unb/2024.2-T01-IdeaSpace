'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, Trash2, Users, Search } from 'lucide-react';
import { ClassDialog } from './components/class-dialog';
import { ViewClassDialog } from './components/view-class-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TurmasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const turmas = [
    { id: 1, nome: 'Turma A', escola: 'Escola Municipal João Paulo', localizacao: 'São Paulo, SP', alunos: 32 },
    { id: 2, nome: 'Turma B', escola: 'Escola Estadual Maria Silva', localizacao: 'Rio de Janeiro, RJ', alunos: 28 },
    { id: 3, nome: 'Turma C', escola: 'Colégio Pedro II', localizacao: 'Belo Horizonte, MG', alunos: 30 },
  ];

  const locations = [...new Set(turmas.map(t => t.localizacao))];

  const filteredTurmas = turmas.filter(turma => 
    turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedSchool || turma.escola === selectedSchool) &&
    (!selectedLocation || turma.localizacao === selectedLocation)
  );

  const handleDelete = (id: number) => {
    setSelectedClass(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting class:', selectedClass);
    setDeleteDialogOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Turmas</h1>
        <ClassDialog
          mode="create"
          trigger={
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Users className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por escola" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(turmas.map(t => t.escola))].map(escola => (
              <SelectItem key={escola} value={escola}>
                {escola}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por localização" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTurmas.map((turma) => (
          <Card key={turma.id}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{turma.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">{turma.escola}</p>
                <p className="text-sm text-muted-foreground">{turma.localizacao}</p>
                <p className="text-sm">Alunos: {turma.alunos}</p>
                <div className="flex gap-2 mt-4">
                  <ViewClassDialog class={turma} />
                  <ClassDialog
                    mode="edit"
                    class={turma}
                    trigger={
                      <Button size="icon" variant="outline" className="text-amber-500 hover:text-amber-600">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(turma.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}