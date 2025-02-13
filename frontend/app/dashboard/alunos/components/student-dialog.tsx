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
import { createStudent, updateStudent } from '@/services/students';
import { fetchClassrooms, removeStudentFromClassroom } from '@/services/classrooms';
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

interface StudentDialogProps {
  mode: 'create' | 'edit';
  student?: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function StudentDialog({ mode, student, trigger, onSuccess }: StudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    username: string;
    full_name: string;
    password: string;
    classrooms: number[];
  }>(() => {
    return mode === 'create'
      ? {
          username: '',
          full_name: '',
          password: '',
          classrooms: [],
        }
      : {
          username: student?.user.username || '',
          full_name: student?.user.full_name || '',
          password: '',
          classrooms: student?.classroom ? [student.classroom.id] : [],
        };
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState<any[]>([]);

  // Estado para o AlertDialog de confirmação de remoção de turma
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [classroomToRemove, setClassroomToRemove] = useState<number | null>(null);

  // Carrega as turmas sempre que o diálogo é aberto
  useEffect(() => {
    if (open) {
      loadClassrooms();
    }
  }, [open]);

  // Atualiza o estado caso o mode ou o student mudem (útil no caso de reaberturas do diálogo)
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
        username: student?.user.username || '',
        full_name: student?.user.full_name || '',
        password: '',
        classrooms: student?.classroom ? [student.classroom.id] : [],
      });
    }
  }, [mode, student]);

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

  // Verifica se o nome de usuário contém espaços
  const isUsernameInvalid = mode === 'create' && /\s/.test(formData.username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação para impedir espaços no nome de usuário
    if (mode === 'create' && isUsernameInvalid) {
      toast({
        title: 'Erro',
        description: 'O nome de usuário não pode conter espaços',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (mode === 'create' && formData.classrooms.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione uma turma.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      if (mode === 'create') {
        await createStudent({
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          classrooms: formData.classrooms,
        });
        toast({
          title: 'Sucesso',
          description: 'Aluno criado com sucesso',
        });
      } else {
        if (student?.classroom && formData.classrooms.length === 0) {
          await removeStudentFromClassroom(student.classroom.id, student.user_id);
        }

        await updateStudent(student.user_id, {
          username: formData.username,
          password: formData.password || undefined,
          full_name: formData.full_name,
          classrooms: formData.classrooms,
        });
        toast({
          title: 'Sucesso',
          description: 'Aluno atualizado com sucesso',
        });
      }

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
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

  const handleClassroomToggle = (classroomId: number) => {
    if (
      mode === 'edit' &&
      student?.classroom?.id === classroomId &&
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
        : [classroomId],
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

  // Função para resetar os dados quando o diálogo for aberto em modo create
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
              {mode === 'create' ? 'Novo Aluno' : 'Editar Aluno'}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Adicionar Novo Aluno' : 'Editar Aluno'}
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
              <Label>Turma</Label>
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
              Tem certeza que deseja remover o aluno desta turma? Esta ação pode ser revertida posteriormente.
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
