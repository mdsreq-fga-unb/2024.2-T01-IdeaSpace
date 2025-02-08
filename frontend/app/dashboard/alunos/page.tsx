'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, Trash2, UserPlus, Search } from 'lucide-react';
import { StudentDialog } from './components/student-dialog';
import { ViewStudentDialog } from './components/view-student-dialog';
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
import { fetchStudent, deleteStudent, fetchClassrooms } from '@/services/api';

export default function AlunosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, classroomsData] = await Promise.all([
        fetchStudent(),
        fetchClassrooms()
      ]);

      // Ensure we have valid data before updating state
      if (Array.isArray(studentsData) && Array.isArray(classroomsData)) {
        setStudents(studentsData);
        setClassrooms(classroomsData);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId: number) => {
    setSelectedStudent(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      await deleteStudent(selectedStudent);
      toast({
        title: 'Sucesso',
        description: 'Aluno excluído com sucesso',
      });
      await loadData(); // Reload data after successful deletion
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir aluno',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
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

  // Get classrooms filtered by selected school
  const filteredClassrooms = classrooms
    .filter(classroom =>
      (!selectedCountry || classroom.school.city.country.id.toString() === selectedCountry) &&
      (!selectedCity || classroom.school.city.id.toString() === selectedCity) &&
      (!selectedSchool || classroom.school.id.toString() === selectedSchool)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Reset dependent selections when parent selection changes
  const handleCountryChange = (value: string) => {
    if (value === 'all') {
      setSelectedCountry(null);
      setSelectedCity(null);
      setSelectedSchool(null);
      setSelectedClassroom(null);
    } else {
      setSelectedCountry(value);
      setSelectedCity(null);
      setSelectedSchool(null);
      setSelectedClassroom(null);
    }
  };

  const handleCityChange = (value: string) => {
    if (value === 'all') {
      setSelectedCity(null);
      setSelectedSchool(null);
      setSelectedClassroom(null);
    } else {
      setSelectedCity(value);
      setSelectedSchool(null);
      setSelectedClassroom(null);
    }
  };

  const handleSchoolChange = (value: string) => {
    if (value === 'all') {
      setSelectedSchool(null);
      setSelectedClassroom(null);
    } else {
      setSelectedSchool(value);
      setSelectedClassroom(null);
    }
  };

  const handleClassroomChange = (value: string) => {
    if (value === 'all') {
      setSelectedClassroom(null);
    } else {
      setSelectedClassroom(value);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.username.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesCountry =
      !selectedCountry ||
      (student.classroom?.school?.city?.country?.id &&
        student.classroom.school.city.country.id.toString() === selectedCountry);
  
    const matchesCity =
      !selectedCity ||
      (student.classroom?.school?.city?.id &&
        student.classroom.school.city.id.toString() === selectedCity);
  
    const matchesSchool =
      !selectedSchool ||
      (student.classroom?.school?.id &&
        student.classroom.school.id.toString() === selectedSchool);
  
    const matchesClassroom =
      !selectedClassroom ||
      (student.classroom?.id && student.classroom.id.toString() === selectedClassroom);
  
    return matchesSearch && matchesCountry && matchesCity && matchesSchool && matchesClassroom;
  });  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Alunos</h1>
        <StudentDialog
          mode="create"
          onSuccess={loadData}
          trigger={
            <Button className="bg-pink-600 hover:bg-pink-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
          }
        />
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

        <Select 
          value={selectedClassroom || ''} 
          onValueChange={handleClassroomChange}
          disabled={!selectedSchool}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder={selectedSchool ? "Filtrar por turma" : "Selecione uma escola primeiro"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as turmas</SelectItem>
            {filteredClassrooms.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id.toString()}>
                {classroom.name}
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
          {filteredStudents.map((student) => (
            <Card key={student.user_id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">
                  {student.user.full_name || student.user.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Usuário: {student.user.username}</p>
                  <p className="text-sm">
                    Turma: {student.classroom?.name || 'Sem turma'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Escola: {student.classroom?.school.name || 'Sem escola'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <ViewStudentDialog student={student} />
                    <StudentDialog
                      mode="edit"
                      student={student}
                      onSuccess={loadData}
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
                      onClick={() => handleDelete(student.user_id)}
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
              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
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