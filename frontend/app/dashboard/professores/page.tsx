'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, Trash2, UserPlus, Search } from 'lucide-react';
import { TeacherDialog } from './components/teacher-dialog';
import { ViewTeacherDialog } from './components/view-teacher-dialog';
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
import { Badge } from '@/components/ui/badge';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const delete_success = () => {
  toast.success('Professor removido com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
};

export default function ProfessoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);

  const professores = [
    {
      id: 1,
      nome: 'Maria Silva',
      username: 'mariasilva',
      disciplinas: ['Matemática', 'Física'],
      turmas: ['Turma A', 'Turma B'],
    },
    {
      id: 2,
      nome: 'João Santos',
      username: 'joaosantos',
      disciplinas: ['Português', 'História'],
      turmas: ['Turma C'],
    },
    {
      id: 3,
      nome: 'Ana Oliveira',
      username: 'anaoliveira',
      disciplinas: ['Química', 'Biologia'],
      turmas: ['Turma A', 'Turma B', 'Turma C'],
    },
  ];

  const disciplinas = [...new Set(professores.flatMap(p => p.disciplinas))];

  const filteredProfessores = professores.filter(professor => 
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedDisciplina || professor.disciplinas.includes(selectedDisciplina))
  );

  const handleDelete = (id: number) => {
    setSelectedTeacher(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting teacher:', selectedTeacher);
    delete_success();
    setDeleteDialogOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Professores</h1>
        <TeacherDialog
          mode="create"
          trigger={
            <Button className="bg-pink-600 hover:bg-pink-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Professor
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
        <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por disciplina" />
          </SelectTrigger>
          <SelectContent>
            {disciplinas.map(disciplina => (
              <SelectItem key={disciplina} value={disciplina}>
                {disciplina}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfessores.map((professor) => (
          <Card key={professor.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">{professor.nome}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{professor.username}</p>
                <div className="flex flex-wrap gap-1">
                  {professor.disciplinas.map((disciplina) => (
                    <Badge key={disciplina} variant="secondary" className="text-xs">
                      {disciplina}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm">Turmas: {professor.turmas.length}</p>
                <div className="flex gap-2 mt-4">
                  <ViewTeacherDialog teacher={professor} />
                  <TeacherDialog
                    mode="edit"
                    teacher={professor}
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
                    onClick={() => handleDelete(professor.id)}
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
              Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
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