'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, PencilIcon, Trash2, Search, Plus } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { fetchCountries, fetchCities, createCountry, createCity, deleteCountry, deleteCity } from '@/services/api';

interface LocationDialogProps {
  mode: 'create' | 'edit';
  trigger?: React.ReactNode;
}

interface Country {
  id: number;
  name: string;
  slug_name: string;
}

interface City {
  id: number;
  name: string;
  country_id: number;
  slug_name: string;
  country: Country;
}

export function LocationDialog({ mode, trigger }: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formType, setFormType] = useState<'country' | 'city'>('country');
  const [formData, setFormData] = useState({
    name: '',
    countryId: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; type: 'country' | 'city' } | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [countriesData, citiesData] = await Promise.all([
        fetchCountries(),
        fetchCities()
      ]);
      setCountries(countriesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formType === 'country') {
        await createCountry(formData.name);
        toast({
          title: 'Sucesso',
          description: 'País criado com sucesso',
        });
      } else {
        if (!formData.countryId) {
          toast({
            title: 'Erro',
            description: 'Selecione um país',
            variant: 'destructive',
          });
          return;
        }
        await createCity(formData.name, parseInt(formData.countryId));
        toast({
          title: 'Sucesso',
          description: 'Cidade criada com sucesso',
        });
      }
      setShowForm(false);
      setFormData({ name: '', countryId: '' });
      loadData();
    } catch (error) {
      console.error('Error creating location:', error);
      toast({
        title: 'Erro',
        description: `Erro ao criar ${formType === 'country' ? 'país' : 'cidade'}`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (id: number, type: 'country' | 'city') => {
    setSelectedItem({ id, type });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      if (selectedItem.type === 'country') {
        await deleteCountry(selectedItem.id);
        toast({
          title: 'Sucesso',
          description: 'País excluído com sucesso',
        });
      } else {
        await deleteCity(selectedItem.id);
        toast({
          title: 'Sucesso',
          description: 'Cidade excluída com sucesso',
        });
      }
      loadData();
    } catch (error: any) {
      console.error('Error deleting location:', error);
      
      // Handle specific error messages from the backend
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('has cities associated')) {
        toast({
          title: 'Erro ao excluir país',
          description: 'Não é possível excluir o país pois existem cidades associadas a ele. Exclua as cidades primeiro.',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('has schools associated')) {
        toast({
          title: 'Erro ao excluir cidade',
          description: 'Não é possível excluir a cidade pois existem escolas associadas a ela. Exclua as escolas primeiro.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: `Erro ao excluir ${selectedItem.type === 'country' ? 'país' : 'cidade'}`,
          variant: 'destructive',
        });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const filteredLocations = {
    countries: countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    cities: cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            Gerenciar Localizações
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Localizações</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formType === 'country' ? 'default' : 'outline'}
                  onClick={() => setFormType('country')}
                  className={formType === 'country' ? 'bg-pink-600 hover:bg-pink-700' : ''}
                >
                  País
                </Button>
                <Button
                  type="button"
                  variant={formType === 'city' ? 'default' : 'outline'}
                  onClick={() => setFormType('city')}
                  className={formType === 'city' ? 'bg-pink-600 hover:bg-pink-700' : ''}
                >
                  Cidade
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{formType === 'country' ? 'Nome do País' : 'Nome da Cidade'}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {formType === 'city' && (
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select
                    value={formData.countryId}
                    onValueChange={(value) => setFormData({ ...formData, countryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um país" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                <Plus className="h-4 w-4 mr-2" />
                Nova Localização
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Países</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredLocations.countries.map((country) => (
                      <Card key={country.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{country.name}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(country.id, 'country')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Cidades</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredLocations.cities.map((city) => (
                      <Card key={city.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{city.name}</p>
                                <p className="text-sm text-muted-foreground">{city.country.name}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(city.id, 'city')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
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