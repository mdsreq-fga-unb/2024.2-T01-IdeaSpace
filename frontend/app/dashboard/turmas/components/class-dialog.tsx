'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface ClassDialogProps {
  mode: 'create' | 'edit';
  class?: {
    id: number;
    nome: string;
    escola: string;
    localizacao: string;
    alunos: number;
  };
  trigger?: React.ReactNode;
}

// Simulated student data - replace with actual data from your backend
const availableStudents = [
  { id: 1, nome: 'Ana Silva', email: 'ana.silva@email.com', ano: '1º Ano' },
  { id: 2, nome: 'Bruno Santos', email: 'bruno.santos@email.com', ano: '2º Ano' },
  { id: 3, nome: 'Carla Oliveira', email: 'carla.oliveira@email.com', ano: '3º Ano' },
  { id: 4, nome: 'Daniel Lima', email: 'daniel.lima@email.com', ano: '1º Ano' },
  { id: 5, nome: 'Elena Costa', email: 'elena.costa@email.com', ano: '2º Ano' },
];

export function ClassDialog({ mode, class: classData, trigger }: ClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: classData?.nome || '',
    escola: classData?.escola || '',
    localizacao: classData?.localizacao || '',
  });
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search term
  const filteredStudents = availableStudents.filter(student =>
    student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission with both class data and selected students
    console.log('Form submitted:', {
      ...formData,
      students: selectedStudents,
    });
    setOpen(false);
  };

  const toggleStudent = (studentId: number) => {
    setSelectedStudents(current =>
      current.includes(studentId)
        ? current.filter(id => id !== studentId)
        : [...current, studentId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            {mode === 'create' ? 'Nova Turma' : 'Editar Turma'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Nova Turma' : 'Editar Turma'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Turma</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="escola">Escola</Label>
              <Input
                id="escola"
                value={formData.escola}
                onChange={(e) => setFormData({ ...formData, escola: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Alunos da Turma</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleStudent(student.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`student-${student.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {student.nome}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {student.email} • {student.ano}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="text-sm text-muted-foreground">
              {selectedStudents.length} aluno(s) selecionado(s)
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              {mode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}