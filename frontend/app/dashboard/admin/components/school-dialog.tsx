'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, PencilIcon, Trash2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface SchoolDialogProps {
  mode: 'create' | 'edit';
  school?: {
    id: number;
    nome: string;
    localizacao: string;
  };
  trigger?: React.ReactNode;
}

// Mock data - replace with actual data from your backend
const schools = [
  { id: 1, nome: 'Escola Municipal João Paulo', localizacao: 'São Paulo, SP' },
  { id: 2, nome: 'Escola Estadual Maria Silva', localizacao: 'Rio de Janeiro, RJ' },
  { id: 3, nome: 'Colégio Pedro II', localizacao: 'Belo Horizonte, MG' },
];

export function SchoolDialog({ mode, school, trigger }: SchoolDialogProps) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: school?.nome || '',
    localizacao: school?.localizacao || '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const filteredSchools = schools.filter(school => 
    school.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({ nome: '', localizacao: '' });
  };

  const handleDelete = (id: number) => {
    setSelectedSchool(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting school:', selectedSchool);
    setDeleteDialogOpen(false);
    setSelectedSchool(null);
  };

  const handleEdit = (school: { id: number; nome: string; localizacao: string }) => {
    setFormData({ nome: school.nome, localizacao: school.localizacao });
    setShowForm(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            Nova Escola
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Escolas</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Escola</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Select
                value={formData.localizacao}
                onValueChange={(value) => setFormData({ ...formData, localizacao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="São Paulo, SP">São Paulo, SP</SelectItem>
                  <SelectItem value="Rio de Janeiro, RJ">Rio de Janeiro, RJ</SelectItem>
                  <SelectItem value="Belo Horizonte, MG">Belo Horizonte, MG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar escola..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-pink-600 hover:bg-pink-700 ml-4">
                Nova Escola
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4">
                {filteredSchools.map((school) => (
                  <Card key={school.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium truncate">{school.nome}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{school.localizacao}</p>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-amber-500 hover:text-amber-600"
                            onClick={() => handleEdit(school)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(school.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta escola? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}