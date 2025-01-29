'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewClassDialogProps {
  class: {
    id: number;
    nome: string;
    escola: string;
    localizacao: string;
    alunos: number;
  };
}

// Simulated student data - replace with actual data from your backend
const classStudents = [
  { id: 1, nome: 'Ana Silva', email: 'ana.silva@email.com', ano: '1º Ano' },
  { id: 2, nome: 'Bruno Santos', email: 'bruno.santos@email.com', ano: '2º Ano' },
  { id: 3, nome: 'Carla Oliveira', email: 'carla.oliveira@email.com', ano: '3º Ano' },
];

export function ViewClassDialog({ class: classData }: ViewClassDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-blue-500 hover:text-blue-600">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Turma</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nome da Turma</h4>
              <p className="text-base">{classData.nome}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Total de Alunos</h4>
              <p className="text-base">{classData.alunos}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Escola</h4>
              <p className="text-base">{classData.escola}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Localização</h4>
              <p className="text-base">{classData.localizacao}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Lista de Alunos</h4>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-4">
                {classStudents.map((student) => (
                  <div key={student.id} className="grid gap-1">
                    <p className="font-medium">{student.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.email} • {student.ano}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}