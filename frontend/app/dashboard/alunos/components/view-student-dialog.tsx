'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ViewStudentDialogProps {
  student: any;
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
            <p className="text-base">{student.user.full_name || student.user.username}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nome de Usuário</h4>
            <p className="text-base">{student.user.username}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Turma</h4>
            <p className="text-base">{student.classroom?.name || 'Sem turma'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Escola</h4>
            <p className="text-base">{student.classroom?.school.name || 'Sem escola'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Cidade</h4>
            <p className="text-base">{student.classroom?.school.city.name || 'N/A'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}