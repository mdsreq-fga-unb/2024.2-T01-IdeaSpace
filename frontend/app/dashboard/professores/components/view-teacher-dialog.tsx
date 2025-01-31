'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ViewTeacherDialogProps {
  teacher: {
    id: number;
    username: string;
    full_name: string | null;
    is_active: boolean;
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Professor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nome Completo</h4>
            <p className="text-base">{teacher.full_name || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Nome de Usuário</h4>
            <p className="text-base">Usuário: {teacher.username}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
            <Badge variant={teacher.is_active ? 'default' : 'secondary'} className="mt-1">
              {teacher.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}