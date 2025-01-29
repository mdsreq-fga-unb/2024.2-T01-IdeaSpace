'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2, Building } from 'lucide-react';
import { SchoolDialog } from './school-dialog';
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
import { useState } from 'react';

// Mock data - replace with actual data from your backend
const schools = [
  { id: 1, nome: 'Escola Municipal João Paulo', localizacao: 'São Paulo, SP' },
  { id: 2, nome: 'Escola Estadual Maria Silva', localizacao: 'Rio de Janeiro, RJ' },
  { id: 3, nome: 'Colégio Pedro II', localizacao: 'Belo Horizonte, MG' },
];

export function SchoolsSection() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setSelectedSchool(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting school:', selectedSchool);
    setDeleteDialogOpen(false);
    setSelectedSchool(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Escolas</h2>
        <SchoolDialog mode="create" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <Card key={school.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                <span className="text-lg font-semibold">{school.nome}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{school.localizacao}</p>
                <div className="flex gap-2">
                  <SchoolDialog
                    mode="edit"
                    school={school}
                    trigger={
                      <Button size="icon" variant="outline" className="text-amber-500 hover:text-amber-600">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
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
    </div>
  );
}