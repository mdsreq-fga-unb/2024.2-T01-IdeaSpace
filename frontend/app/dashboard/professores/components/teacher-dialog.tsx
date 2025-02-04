'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const create_success = () => {
  toast.success('Professor criado com sucesso', {
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
  toast.success('Professor editado com sucesso', {
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

interface TeacherDialogProps {
  mode: 'create' | 'edit';
  teacher?: {
    id: number;
    nome: string;
    username: string;
    disciplinas: string[];
    turmas: string[];
  };
  trigger?: React.ReactNode;
}

// Mock data - replace with actual data from your backend
const availableClasses = [
  { id: 1, nome: 'Turma A', escola: 'Escola Municipal João Paulo' },
  { id: 2, nome: 'Turma B', escola: 'Escola Estadual Maria Silva' },
  { id: 3, nome: 'Turma C', escola: 'Colégio Pedro II' },
];

const subjects = [
  'Matemática',
  'Português',
  'História',
  'Geografia',
  'Ciências',
  'Física',
  'Química',
  'Biologia',
];

export function TeacherDialog({ mode, teacher, trigger }: TeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: teacher?.nome || '',
    username: teacher?.username || '',
    senha: '',
    disciplinas: teacher?.disciplinas || [],
    turmas: teacher?.turmas || [],
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = availableClasses.filter(cls =>
    cls.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.escola.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(subject)
        ? prev.disciplinas.filter(s => s !== subject)
        : [...prev.disciplinas, subject]
    }));
  };

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
          </div>

          <div className="space-y-4">
            <Label>Disciplinas</Label>
            <div className="grid grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.disciplinas.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                  />
                  <label
                    htmlFor={`subject-${subject}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject}
                  </label>
                </div>
              ))}
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