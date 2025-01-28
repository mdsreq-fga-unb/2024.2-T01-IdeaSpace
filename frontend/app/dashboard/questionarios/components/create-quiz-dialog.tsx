'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus } from 'lucide-react';

interface CreateQuizDialogProps {
  trigger?: React.ReactNode;
}

export function CreateQuizDialog({ trigger }: CreateQuizDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tema: '',
    duracao: '',
    quantidadeQuestoes: '',
    turmas: [] as string[],
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual data from your backend
  const turmas = [
    { id: 1, nome: 'Turma A', escola: 'Escola Municipal João Paulo' },
    { id: 2, nome: 'Turma B', escola: 'Escola Estadual Maria Silva' },
    { id: 3, nome: 'Turma C', escola: 'Colégio Pedro II' },
  ];

  const temas = [
    'Matemática',
    'Português',
    'História',
    'Geografia',
    'Ciências',
    'Física',
    'Química',
    'Biologia',
  ];

  const filteredTurmas = turmas.filter(turma =>
    turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    turma.escola.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setOpen(false);
  };

  const toggleTurma = (turmaNome: string) => {
    setFormData(prev => ({
      ...prev,
      turmas: prev.turmas.includes(turmaNome)
        ? prev.turmas.filter(t => t !== turmaNome)
        : [...prev.turmas, turmaNome]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Questionário
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Questionário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tema">Tema</Label>
              <Select
                value={formData.tema}
                onValueChange={(value) => setFormData({ ...formData, tema: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  {temas.map(tema => (
                    <SelectItem key={tema} value={tema}>{tema}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (minutos)</Label>
              <Input
                id="duracao"
                type="number"
                min="1"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidadeQuestoes">Quantidade de Questões</Label>
              <Input
                id="quantidadeQuestoes"
                type="number"
                min="1"
                value={formData.quantidadeQuestoes}
                onChange={(e) => setFormData({ ...formData, quantidadeQuestoes: e.target.value })}
                required
              />
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
                  {filteredTurmas.map((turma) => (
                    <div key={turma.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`turma-${turma.id}`}
                        checked={formData.turmas.includes(turma.nome)}
                        onCheckedChange={() => toggleTurma(turma.nome)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`turma-${turma.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {turma.nome}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {turma.escola}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground">
                {formData.turmas.length} turma(s) selecionada(s)
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              Criar Questionário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}