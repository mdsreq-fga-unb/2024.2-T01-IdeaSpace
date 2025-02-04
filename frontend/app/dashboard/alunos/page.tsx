'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, Trash2, UserPlus, Search } from 'lucide-react';
import { StudentDialog } from './components/student-dialog';
import { ViewStudentDialog } from './components/view-student-dialog';
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
import { ToastContainer, toast, Bounce } from 'react-toastify';

const delete_success = () => {
  toast.success('Aluno removido com sucesso', {
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

export default function AlunosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const alunos = [
    { 
      id: 1, 
      nome: 'Ana Silva', 
      username: 'anasilva', 
      ano: '1º Ano', 
      turma: 'Turma A',
      escola: 'Escola Municipal João Paulo'
    },
    { 
      id: 2, 
      nome: 'Bruno Santos', 
      username: 'brunosantos', 
      ano: '2º Ano', 
      turma: 'Turma B',
      escola: 'Escola Estadual Maria Silva'
    },
    { 
      id: 3, 
      nome: 'Carla Oliveira', 
      username: 'carlaoliveira', 
      ano: '3º Ano', 
      turma: 'Turma C',
      escola: 'Colégio Pedro II'
    },
  ];

  const filteredAlunos = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedYear || aluno.ano === selectedYear) &&
    (!selectedSchool || aluno.escola === selectedSchool)
  );

  const handleDelete = (id: number) => {
    setSelectedStudent(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting student:', selectedStudent);
    delete_success();
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
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
        <h1 className="text-3xl font-bold">Alunos</h1>
        <StudentDialog
          mode="create"
          trigger={
            <Button className="bg-pink-600 hover:bg-pink-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Aluno
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
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1º Ano">1º Ano</SelectItem>
            <SelectItem value="2º Ano">2º Ano</SelectItem>
            <SelectItem value="3º Ano">3º Ano</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por escola" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(alunos.map(a => a.escola))].map(escola => (
              <SelectItem key={escola} value={escola}>{escola}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlunos.map((aluno) => (
          <Card key={aluno.id}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{aluno.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Usuário: {aluno.username}</p>
                <p className="text-sm">Ano: {aluno.ano}</p>
                <p className="text-sm">Turma: {aluno.turma}</p>
                <p className="text-sm">Escola: {aluno.escola}</p>
                <div className="flex gap-2 mt-4">
                  <ViewStudentDialog student={aluno} />
                  <StudentDialog
                    mode="edit"
                    student={aluno}
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
                    onClick={() => handleDelete(aluno.id)}
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
              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
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