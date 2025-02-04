'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const create_success = () => {
  toast.success('Aluno criado com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
};

const edit_success = () => {
  toast.success('Aluno editado com sucesso', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
};

interface StudentDialogProps {
  mode: 'create' | 'edit';
  student?: {
    id: number;
    nome: string;
    username: string;
    ano: string;
    turma: string;
    escola: string;
    senha?: string;
  };
  trigger?: React.ReactNode;
}

// Mock data - replace with actual data from your backend
const availableClasses = [
  { id: 1, nome: 'Turma A', escola: 'Escola Municipal João Paulo' },
  { id: 2, nome: 'Turma B', escola: 'Escola Estadual Maria Silva' },
  { id: 3, nome: 'Turma C', escola: 'Colégio Pedro II' },
];

export function StudentDialog({ mode, student, trigger }: StudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: student?.nome || '',
    username: student?.username || '',
    ano: student?.ano || '',
    senha: student?.senha || '',
    turmas: student?.turma ? [student.turma] : [],
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = availableClasses.filter(cls =>
    cls.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.escola.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    mode === 'create' ? create_success() : edit_success()
    setOpen(false);
  };

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      turmas: prev.turmas.includes(className)
        ? prev.turmas.filter(c => c !== className)
        : [...prev.turmas, className]
    }));
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Novo Aluno' : 'Editar Aluno'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">
                {mode === 'create' ? 'Senha' : 'Nova Senha (deixe em branco para manter a atual)'}
              </Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required={mode === 'create'}
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
                {filteredClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${cls.id}`}
                      checked={formData.turmas.includes(cls.nome)}
                      onCheckedChange={() => toggleClass(cls.nome)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`class-${cls.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cls.nome}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {cls.escola}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
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