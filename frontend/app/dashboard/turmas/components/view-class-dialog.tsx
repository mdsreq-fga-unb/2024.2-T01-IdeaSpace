'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getClassroomWithUsers } from '@/services/classrooms';
import { useToast } from '@/hooks/use-toast';

interface ViewClassDialogProps {
  classroom: any;
}

export function ViewClassDialog({ classroom }: ViewClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classroomDetails, setClassroomDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadClassroomDetails();
    }
  }, [open]);

  const loadClassroomDetails = async () => {
    try {
      const data = await getClassroomWithUsers(classroom.id);
      setClassroomDetails(data);
    } catch (error) {
      console.error('Error loading classroom details:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes da turma',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="text-blue-500 hover:text-blue-600">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-full sm:max-w-2xl p-4 overflow-y-auto max-h-[calc(100vh-2rem)]">
        <DialogHeader>
          <DialogTitle>Detalhes da Turma</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nome da Turma</h4>
              <p className="text-base">{classroom.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Escola</h4>
              <p className="text-base">{classroom.school.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Cidade</h4>
              <p className="text-base">{classroom.school.city.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">País</h4>
              <p className="text-base">{classroom.school.city.country.name}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <p>Carregando informações...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Professores</h4>
                <ScrollArea className="border rounded-md p-4 h-32 sm:h-[120px]">
                  <div className="space-y-2">
                    {classroomDetails?.teachers?.length > 0 ? (
                      classroomDetails.teachers.map((teacher: any) => (
                        <div key={teacher.user_id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                          <div>
                            <p className="font-medium">
                              {teacher.user.full_name || teacher.user.username}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.user.username}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum professor atribuído a esta turma
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Alunos</h4>
                <ScrollArea className="border rounded-md p-4 h-48 sm:h-[280px]">
                  <div className="space-y-2">
                    {classroomDetails?.students?.length > 0 ? (
                      classroomDetails.students.map((student: any) => (
                        <div key={student.user_id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                          <div>
                            <p className="font-medium">
                              {student.user.full_name || student.user.username}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.user.username}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum aluno matriculado nesta turma
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}