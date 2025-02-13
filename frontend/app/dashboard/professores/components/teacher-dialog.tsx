'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTeacher, updateTeacher } from '@/services/teachers';
import { fetchClassrooms, removeTeacherFromClassroom, addTeacherToClassroom } from '@/services/classrooms';
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

interface TeacherDialogProps {
  mode: 'create' | 'edit';
  teacher?: any; 
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

interface Classroom {
  id: number;
  name: string;
  school: {
    name: string;
    city: {
      name: string;
    };
  };
}

export function TeacherDialog({ mode, teacher, trigger, onSuccess }: TeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estado inicial para o formulário
  const initialFormData = mode === 'create'
    ? {
        username: '',
        full_name: '',
        password: '',
        classrooms: [] as number[],
      }
    : {
        username: teacher?.user.username || '',
        full_name: teacher?.user.full_name || '',
        password: '',
        classrooms: teacher?.classrooms?.map((c: any) => c.id) || [],
      };

  const [formData, setFormData] = useState<{
    username: string;
    full_name: string;
    password: string;
    classrooms: number[];
  }>(initialFormData);

  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Estados para o AlertDialog de confirmação de remoção de turma
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [classroomToRemove, setClassroomToRemove] = useState<number | null>(null);

  // Carrega as turmas sempre que o diálogo é aberto
  useEffect(() => {
    if (open) {
      loadClassrooms();
    }
  }, [open]);

  // Atualiza o estado do formulário se o mode ou o teacher mudarem
  useEffect(() => {
    if (mode === 'create') {
      setFormData({
        username: '',
        full_name: '',
        password: '',
        classrooms: [],
      });
    } else {
      setFormData({
        username: teacher?.user.username || '',
        full_name: teacher?.user.full_name || '',
        password: '',
        classrooms: teacher?.classrooms?.map((c: any) => c.id) || [],
      });
    }
  }, [mode, teacher]);

  const loadClassrooms = async () => {
    try {
      const data = await fetchClassrooms();
      setClassrooms(data);
    } catch (error) {
      console.error('Error loading classrooms:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as turmas',
        variant: 'destructive',
      });
    }
  };

  const isUsernameInvalid = mode === 'create' && /\s/.test(formData.username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação para evitar espaços no nome de usuário
    if (mode === 'create' && isUsernameInvalid) {
      toast({
        title: 'Erro',
        description: 'O nome de usuário não pode conter espaços',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      if (mode === 'create') {
        await createTeacher({
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          classrooms: formData.classrooms,
        });
        toast({
          title: 'Sucesso',
          description: 'Professor criado com sucesso',
        });
      } else {
        // Atualiza os dados básicos do professor
        await updateTeacher(teacher.user_id, {
          username: formData.username,
          password: formData.password || undefined,
          full_name: formData.full_name,
        });

        // Atualiza as turmas associadas
        const initialClassrooms: number[] = teacher.classrooms.map((c: any) => c.id);
        const newClassrooms: number[] = formData.classrooms;
        const removedClassrooms = initialClassrooms.filter(id => !newClassrooms.includes(id));
        const addedClassrooms = newClassrooms.filter(id => !initialClassrooms.includes(id));

        await Promise.all(
          removedClassrooms.map((classroomId) =>
            removeTeacherFromClassroom(classroomId, teacher.user_id)
          )
        );
        await Promise.all(
          addedClassrooms.map((classroomId) =>
            addTeacherToClassroom(classroomId, teacher.user_id)
          )
        );

        toast({
          title: 'Sucesso',
          description: 'Professor atualizado com sucesso',
        });
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Erro ao processar a requisição.';
      if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Se estiver em modo edit e o professor já possuía a turma, exibe confirmação ao desmarcar
  const handleClassroomToggle = (classroomId: number) => {
    if (
      mode === 'edit' &&
      teacher?.classrooms?.some((c: any) => c.id === classroomId) &&
      formData.classrooms.includes(classroomId)
    ) {
      setClassroomToRemove(classroomId);
      setAlertDialogOpen(true);
    } else {
      toggleClassroom(classroomId);
    }
  };

  const toggleClassroom = (classroomId: number) => {
    setFormData((prev) => ({
      ...prev,
      classrooms: prev.classrooms.includes(classroomId)
        ? prev.classrooms.filter((id) => id !== classroomId)
        : [...prev.classrooms, classroomId],
    }));
  };

  const handleRemoveConfirm = () => {
    if (classroomToRemove !== null) {
      toggleClassroom(classroomToRemove);
    }
    setAlertDialogOpen(false);
    setClassroomToRemove(null);
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.school.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reseta os dados do formulário ao abrir o diálogo em modo create
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && mode === 'create') {
      setFormData({
        username: '',
        full_name: '',
        password: '',
        classrooms: [],
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-pink-600 hover:bg-pink-700">
              {mode === 'create' ? 'Novo Professor' : 'Editar Professor'}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Adicionar Novo Professor' : 'Editar Professor'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={mode === 'edit'}
                  className={isUsernameInvalid ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {isUsernameInvalid && (
                  <p className="text-sm text-red-500">
                    O nome de usuário não pode conter espaços
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {mode === 'create'
                    ? 'Senha'
                    : 'Nova Senha (deixe em branco para manter a atual)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={mode === 'create'}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Turmas</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar turmas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                <div className="space-y-4">
                  {filteredClassrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`classroom-${classroom.id}`}
                        checked={formData.classrooms.includes(classroom.id)}
                        onCheckedChange={() => handleClassroomToggle(classroom.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`classroom-${classroom.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {classroom.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {classroom.school.name} - {classroom.school.city.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground">
                {formData.classrooms.length} turma(s) selecionada(s)
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700"
                disabled={loading}
              >
                {loading ? 'Salvando...' : mode === 'create' ? 'Adicionar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção da turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o professor desta turma?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRemoveConfirm}
            >
              Remover da Turma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
