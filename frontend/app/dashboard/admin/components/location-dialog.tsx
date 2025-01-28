'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, PencilIcon, Trash2, Search } from 'lucide-react';
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

interface LocationDialogProps {
  mode: 'create' | 'edit';
  location?: {
    id: number;
    cidade: string;
    estado: string;
  };
  trigger?: React.ReactNode;
}

// Mock data - replace with actual data from your backend
const locations = [
  { id: 1, cidade: 'São Paulo', estado: 'SP' },
  { id: 2, cidade: 'Rio de Janeiro', estado: 'RJ' },
  { id: 3, cidade: 'Belo Horizonte', estado: 'MG' },
];

export function LocationDialog({ mode, location, trigger }: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    cidade: location?.cidade || '',
    estado: location?.estado || '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const filteredLocations = locations.filter(location => 
    location.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({ cidade: '', estado: '' });
  };

  const handleDelete = (id: number) => {
    setSelectedLocation(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting location:', selectedLocation);
    setDeleteDialogOpen(false);
    setSelectedLocation(null);
  };

  const handleEdit = (location: { id: number; cidade: string; estado: string }) => {
    setFormData({ cidade: location.cidade, estado: location.estado });
    setShowForm(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            Nova Localização
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Localizações</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
              />
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
                  placeholder="Buscar localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-pink-600 hover:bg-pink-700 ml-4">
                Nova Localização
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4">
                {filteredLocations.map((location) => (
                  <Card key={location.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{location.cidade}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{location.estado}</p>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-amber-500 hover:text-amber-600"
                            onClick={() => handleEdit(location)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(location.id)}
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
              Tem certeza que deseja excluir esta localização? Esta ação não pode ser desfeita.
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