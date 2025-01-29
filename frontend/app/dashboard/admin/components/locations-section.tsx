'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2, MapPin } from 'lucide-react';
import { LocationDialog } from './location-dialog';
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
const locations = [
  { id: 1, cidade: 'São Paulo', estado: 'SP' },
  { id: 2, cidade: 'Rio de Janeiro', estado: 'RJ' },
  { id: 3, cidade: 'Belo Horizonte', estado: 'MG' },
];

export function LocationsSection() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setSelectedLocation(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting location:', selectedLocation);
    setDeleteDialogOpen(false);
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Localizações</h2>
        <LocationDialog mode="create" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg font-semibold">{location.cidade}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{location.estado}</p>
                <div className="flex gap-2">
                  <LocationDialog
                    mode="edit"
                    location={location}
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
    </div>
  );
}