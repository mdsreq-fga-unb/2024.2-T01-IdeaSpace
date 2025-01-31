'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createUser, updateUser } from '@/services/api';

interface TeacherDialogProps {
  mode: 'create' | 'edit';
  teacher?: {
    id: number;
    username: string;
    full_name: string | null;
    is_active: boolean;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function TeacherDialog({ mode, teacher, trigger, onSuccess }: TeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: teacher?.username || '',
    full_name: teacher?.full_name || '',
    password: '',
    is_active: teacher?.is_active ?? true,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'create') {
        await createUser({
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          role: 'teacher',
        });
        toast({
          title: 'Sucesso',
          description: 'Professor criado com sucesso',
        });
      } else if (teacher) {
        const updateData: any = {
          full_name: formData.full_name,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateUser(teacher.id, updateData);
        toast({
          title: 'Sucesso',
          description: 'Professor atualizado com sucesso',
        });
      }
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro',
        description: `Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} professor`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Professor' : 'Editar Professor'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required={mode === 'create'}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === 'create' ? 'Senha' : 'Nova Senha (opcional)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={mode === 'create'}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}