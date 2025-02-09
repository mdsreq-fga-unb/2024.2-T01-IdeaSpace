'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { createQuestionnaire } from '@/services/questionnaire';
import { fetchCategories } from '@/services/categories';
import { fetchQuestions } from '@/services/questions';

interface CreateQuizDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const initialFormState = {
  tema: 'all', // Alterado para 'all' como valor padrão
  duracao: '',
  turmaId: '',
  selectedQuestions: [] as number[],
};

export function CreateQuizDialog({ trigger, onSuccess }: CreateQuizDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Obter as turmas do professor logado
  const teacherClassrooms = user?.teacher?.classrooms || [];

  useEffect(() => {
    if (open) {
      loadCategories();
      loadQuestions();
    } else {
      setFormData(initialFormState);
      setSearchTerm('');
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os temas',
        variant: 'destructive',
      });
    }
  };

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as questões',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos obrigatórios
      if (!formData.turmaId || !formData.duracao || formData.selectedQuestions.length === 0) {
        throw new Error('Todos os campos são obrigatórios e pelo menos uma questão deve ser selecionada');
      }

      const questionnaireData = {
        classroom_id: parseInt(formData.turmaId),
        duration: parseInt(formData.duracao),
        question_ids: formData.selectedQuestions,
      };

      await createQuestionnaire(questionnaireData);

      toast({
        title: 'Sucesso',
        description: 'Questionário criado com sucesso',
      });

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating questionnaire:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar questionário',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionToggle = (questionId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(questionId)
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId]
    }));
  };

  const filteredQuestions = questions.filter(question => {
    const matchesTheme = formData.tema === 'all' || question.category_id.toString() === formData.tema;
    const matchesSearch = searchTerm === '' || 
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return '';
    }
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
              <Label htmlFor="turma">Turma</Label>
              <Select
                value={formData.turmaId}
                onValueChange={(value) => setFormData({ ...formData, turmaId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClassrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id.toString()}>
                      {classroom.name} - {classroom.school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="all">Todos os temas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
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

            <div className="space-y-4">
              <Label>Questões</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar questões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        id={`question-${question.id}`}
                        checked={formData.selectedQuestions.includes(question.id)}
                        onCheckedChange={() => handleQuestionToggle(question.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <label
                          htmlFor={`question-${question.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {question.text}
                        </label>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">
                            {question.category.name}
                          </span>
                          <span className={`font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyLabel(question.difficulty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredQuestions.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhuma questão encontrada
                    </p>
                  )}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground">
                {formData.selectedQuestions.length} questão(ões) selecionada(s)
              </p>
            </div>
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
              {loading ? 'Criando...' : 'Criar Questionário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}