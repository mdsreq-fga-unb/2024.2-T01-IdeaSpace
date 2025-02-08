'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  createClassroom,
  updateClassroom,
  fetchCountries,
  fetchCities,
  fetchSchools,
} from '@/services/api';

interface ClassDialogProps {
  mode: 'create' | 'edit';
  classroom?: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ClassDialog({ mode, classroom, trigger, onSuccess }: ClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Para o modo "create" é necessário armazenar os IDs para seleção, 
  // enquanto no modo "edit" apenas o nome será alterado
  const initialFormData =
    mode === 'create'
      ? {
          name: classroom?.name || '',
          countryId: classroom?.school?.city?.country?.id?.toString() || '',
          cityId: classroom?.school?.city?.id?.toString() || '',
          schoolId: classroom?.school?.id?.toString() || '',
        }
      : {
          name: classroom?.name || '',
        };

  const [formData, setFormData] = useState(initialFormData);

  // Estados utilizados apenas no modo "create"
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && mode === 'create') {
      loadCountries();
      if (formData.countryId) {
        loadCities(parseInt(formData.countryId));
      }
      if (formData.cityId) {
        loadSchools(parseInt(formData.cityId));
      }
    }
  }, [open, formData.countryId, formData.cityId, mode]);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os países',
        variant: 'destructive',
      });
    }
  };

  const loadCities = async (countryId: number) => {
    try {
      const data = await fetchCities();
      setCities(data.filter((city: any) => city.country_id === countryId));
    } catch (error) {
      console.error('Error loading cities:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as cidades',
        variant: 'destructive',
      });
    }
  };

  const loadSchools = async (cityId: number) => {
    try {
      const data = await fetchSchools();
      setSchools(data.filter((school: any) => school.city_id === cityId));
    } catch (error) {
      console.error('Error loading schools:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as escolas',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        if (!formData.schoolId) {
          toast({
            title: 'Erro',
            description: 'Selecione uma escola',
            variant: 'destructive',
          });
          return;
        }

        await createClassroom({
          name: formData.name,
          school_id: parseInt(formData.schoolId),
        });

        toast({
          title: 'Sucesso',
          description: 'Turma criada com sucesso',
        });
      } else if (mode === 'edit') {
        if (!classroom || !classroom.id) {
          toast({
            title: 'Erro',
            description: 'Turma não encontrada',
            variant: 'destructive',
          });
          return;
        }

        // Atualiza a turma apenas com o novo nome
        await updateClassroom(classroom.id, formData.name);
        toast({
          title: 'Sucesso',
          description: 'Turma atualizada com sucesso',
        });
      }

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao processar a requisição',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            {mode === 'create' ? 'Nova Turma' : 'Editar Turma'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Nova Turma' : 'Editar Turma'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Campo de nome, sempre editável */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Turma</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {mode === 'create' && (
              <>
                {/* Campos de localização para criação (editáveis) */}
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select
                    value={formData.countryId}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        countryId: value,
                        cityId: '',
                        schoolId: '',
                      })
                    }
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

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Select
                    value={formData.cityId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, cityId: value, schoolId: '' })
                    }
                    disabled={!formData.countryId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formData.countryId
                            ? 'Selecione uma cidade'
                            : 'Selecione um país primeiro'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Escola</Label>
                  <Select
                    value={formData.schoolId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, schoolId: value })
                    }
                    disabled={!formData.cityId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formData.cityId
                            ? 'Selecione uma escola'
                            : 'Selecione uma cidade primeiro'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id.toString()}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mode === 'edit' && (
              <>
                {/* Campos de localização para edição (visíveis, mas não editáveis) */}
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={classroom?.school?.city?.country?.name || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={classroom?.school?.city?.name || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">Escola</Label>
                  <Input
                    id="school"
                    value={classroom?.school?.name || ''}
                    disabled
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700"
              disabled={loading}
            >
              {loading
                ? 'Salvando...'
                : mode === 'create'
                ? 'Adicionar'
                : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
