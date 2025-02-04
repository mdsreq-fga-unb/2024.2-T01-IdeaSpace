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
import { createTeacher, updateTeacher, fetchClassrooms } from '@/services/api';

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
  const [formData, setFormData] = useState<{
    username: string;
    full_name: string;
    password: string;
    classrooms: number[];
  }>({
    username: teacher?.user.username || '',
    full_name: teacher?.user.full_name || '',
    password: '',
    classrooms: teacher?.classrooms?.map((c: any) => c.id) || [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadClassrooms();
    }
  }, [open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (mode === 'create') {
        // Criar novo professor
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
        // Atualizar professor existente
        await updateTeacher(teacher.user_id, {
          username: formData.username,
          password: formData.password || undefined, // Só envia a senha se foi preenchida
          full_name: formData.full_name,
          classrooms: formData.classrooms,
        });
        toast({
          title: 'Sucesso',
          description: 'Professor atualizado com sucesso',
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
  
  const toggleClassroom = (classroomId: number) => {
    setFormData((prev) => ({
      ...prev,
      classrooms: prev.classrooms.includes(classroomId)
        ? prev.classrooms.filter((id) => id !== classroomId)
        : [...prev.classrooms, classroomId],
    }));
  };
  
  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.school.city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              />
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
                      onCheckedChange={() => toggleClassroom(classroom.id)}
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
  );
}