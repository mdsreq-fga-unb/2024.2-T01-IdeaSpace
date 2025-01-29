'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewTeacherDialogProps {
  teacher: {
    id: number;
    nome: string;
    username: string;
    disciplinas: string[];
    turmas: string[];
  };
}

export function ViewTeacherDialog({ teacher }: ViewTeacherDialogProps) {
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
          <DialogTitle>Detalhes do Professor</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nome</h4>
              <p className="text-base">{teacher.nome}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nome de Usuário</h4>
              <p className="text-base">{teacher.username}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Disciplinas</h4>
            <div className="flex flex-wrap gap-2">
              {teacher.disciplinas.map((disciplina) => (
                <Badge key={disciplina} variant="secondary">
                  {disciplina}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Turmas</h4>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-4">
                {teacher.turmas.map((turma) => (
                  <div key={turma} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                    <span>{turma}</span>
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