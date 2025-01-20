'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ViewStudentDialogProps {
  student: {
    id: number;
    nome: string;
    username: string;
    ano: string;
    turma: string;
    escola: string;
  };
}

export function ViewStudentDialog({ student }: ViewStudentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-blue-500 hover:text-blue-600">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Aluno</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nome</h4>
            <p className="text-base">{student.nome}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nome de Usuário</h4>
            <p className="text-base">{student.username}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Ano</h4>
            <p className="text-base">{student.ano}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Turma</h4>
            <p className="text-base">{student.turma}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Escola</h4>
            <p className="text-base">{student.escola}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}