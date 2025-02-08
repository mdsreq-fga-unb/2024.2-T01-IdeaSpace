'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, Trash2, Users, Search, Plus, Building, MapPin } from 'lucide-react';
import { ClassDialog } from './components/class-dialog';
import { ViewClassDialog } from './components/view-class-dialog';
import { SchoolDialog } from '../admin/components/school-dialog';
import { LocationDialog } from '../admin/components/location-dialog';
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
import { useToast } from '@/hooks/use-toast';
import { fetchClassrooms, deleteClassroom, fetchCountries, fetchCities, fetchSchools } from '@/services/api';

export default function TurmasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const data = await fetchClassrooms();
      setClassrooms(data);
    } catch (error) {
      console.error('Error loading classrooms:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as turmas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedClassroom(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClassroom) return;

    try {
      await deleteClassroom(selectedClassroom);
      toast({
        title: 'Sucesso',
        description: 'Turma excluída com sucesso',
      });
      loadClassrooms();
    } catch (error: any) {
      console.error('Error deleting classroom:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir turma',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedClassroom(null);
  };

  // Get unique countries from classrooms using a Map to ensure uniqueness
  const countries = Array.from(
    new Map(
      classrooms.map(classroom => [
        classroom.school.city.country.id,
        {
          id: classroom.school.city.country.id,
          name: classroom.school.city.country.name
        }
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Get cities filtered by selected country using a Map
  const cities = Array.from(
    new Map(
      classrooms
        .filter(classroom => 
          !selectedCountry || 
          classroom.school.city.country.id.toString() === selectedCountry
        )
        .map(classroom => [
          classroom.school.city.id,
          {
            id: classroom.school.city.id,
            name: classroom.school.city.name
          }
        ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Get schools filtered by selected city using a Map
  const schools = Array.from(
    new Map(
      classrooms
        .filter(classroom => 
          (!selectedCountry || classroom.school.city.country.id.toString() === selectedCountry) &&
          (!selectedCity || classroom.school.city.id.toString() === selectedCity)
        )
        .map(classroom => [
          classroom.school.id,
          {
            id: classroom.school.id,
            name: classroom.school.name
          }
        ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Reset dependent selections when parent selection changes
  const handleCountryChange = (value: string) => {
    if (value === 'all') {
      setSelectedCountry(null);
      setSelectedCity(null);
      setSelectedSchool(null);
    } else {
      setSelectedCountry(value);
      setSelectedCity(null);
      setSelectedSchool(null);
    }
  };

  const handleCityChange = (value: string) => {
    if (value === 'all') {
      setSelectedCity(null);
      setSelectedSchool(null);
    } else {
      setSelectedCity(value);
      setSelectedSchool(null);
    }
  };

  const handleSchoolChange = (value: string) => {
    if (value === 'all') {
      setSelectedSchool(null);
    } else {
      setSelectedSchool(value);
    }
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || classroom.school.city.country.id.toString() === selectedCountry;
    const matchesCity = !selectedCity || classroom.school.city.id.toString() === selectedCity;
    const matchesSchool = !selectedSchool || classroom.school.id.toString() === selectedSchool;
    
    return matchesSearch && matchesCountry && matchesCity && matchesSchool;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Turmas</h1>
        <div className="flex gap-2">
          <LocationDialog
            mode="create"
            trigger={
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" />
                Gerenciar Localizações
              </Button>
            }
          />
          <SchoolDialog
            mode="create"
            trigger={
              <Button variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Gerenciar Escolas
              </Button>
            }
          />
          <ClassDialog
            mode="create"
            onSuccess={loadClassrooms}
            trigger={
              <Button className="bg-pink-600 hover:bg-pink-700">
                <div className="relative flex items-center mr-2">
                  <Users className="h-4 w-4" />
                  <Plus className="h-3 w-3 absolute -right-1.5 -top-1.5" />
                </div>
                Nova Turma
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select 
          value={selectedCountry || ''} 
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os países</SelectItem>
            {countries.map((country: any) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedCity || ''} 
          onValueChange={handleCityChange}
          disabled={!selectedCountry}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder={selectedCountry ? "Filtrar por cidade" : "Selecione um país primeiro"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cidades</SelectItem>
            {cities.map((city: any) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedSchool || ''} 
          onValueChange={handleSchoolChange}
          disabled={!selectedCity}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder={selectedCity ? "Filtrar por escola" : "Selecione uma cidade primeiro"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as escolas</SelectItem>
            {schools.map((school: any) => (
              <SelectItem key={school.id} value={school.id.toString()}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClassrooms.map((classroom) => (
            <Card key={classroom.id}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{classroom.name}</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        Escola: {classroom.school.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Localização: {classroom.school.city.name} - {classroom.school.city.country.name}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <ViewClassDialog classroom={classroom} />
                        <ClassDialog
                          mode="edit"
                          classroom={classroom}
                          onSuccess={loadClassrooms}
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
                          onClick={() => handleDelete(classroom.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                </CardContent>

            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
            Tem certeza de que deseja excluir esta turma? Essa ação é irreversível e removerá permanentemente todos os alunos vinculados a ela.
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