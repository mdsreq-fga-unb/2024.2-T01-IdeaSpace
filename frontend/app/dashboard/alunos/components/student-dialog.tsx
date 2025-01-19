'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentDialogProps {
  mode: 'create' | 'edit';
  student?: {
    id: number;
    nome: string;
    email: string;
    ano: string;
    turma: string;
    escola: string;
    localizacao: string;
  };
  trigger?: React.ReactNode;
}

export function StudentDialog({ mode, student, trigger }: StudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: student?.nome || '',
    email: student?.email || '',
    ano: student?.ano || '',
    turma: student?.turma || '',
    escola: student?.escola || '',
    localizacao: student?.localizacao || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            {mode === 'create' ? 'Novo Aluno' : 'Editar Aluno'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Novo Aluno' : 'Editar Aluno'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escola">Escola</Label>
            <Input
              id="escola"
              value={formData.escola}
              onChange={(e) => setFormData({ ...formData, escola: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano">Ano</Label>
            <Select
              value={formData.ano}
              onValueChange={(value) => setFormData({ ...formData, ano: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1º Ano">1º Ano</SelectItem>
                <SelectItem value="2º Ano">2º Ano</SelectItem>
                <SelectItem value="3º Ano">3º Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="turma">Turma</Label>
            <Select
              value={formData.turma}
              onValueChange={(value) => setFormData({ ...formData, turma: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Turma A">Turma A</SelectItem>
                <SelectItem value="Turma B">Turma B</SelectItem>
                <SelectItem value="Turma C">Turma C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              {mode === 'create' ? 'Adicionar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}