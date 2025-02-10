'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, Trash2, BookPlus, Search, CheckCircle2 } from 'lucide-react';
import { QuestionDialog } from './components/question-dialog';
import { ViewQuestionDialog } from './components/view-question-dialog';
import { CategoryDialog } from './components/category-dialog';
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
import { fetchQuestions, deleteQuestion, Question } from '@/services/questions';
import { fetchCategories, Category } from '@/services/categories';


const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
} as const;

const difficultyLabels = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
} as const;

export default function QuestoesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [selectedDificuldade, setSelectedDificuldade] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsData, categoriesData] = await Promise.all([
        fetchQuestions(),
        fetchCategories()
      ]);
      setQuestions(questionsData);
      setCategories(categoriesData);
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

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: number) => {
    setSelectedQuestion(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuestion) return;

    try {
      await deleteQuestion(selectedQuestion);
      toast({
        title: 'Sucesso',
        description: 'Questão excluída com sucesso',
      });
      loadData();
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir questão',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedQuestion(null);
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTema = !selectedTema || question.category.name === selectedTema;
    const matchesDificuldade = !selectedDificuldade || question.difficulty === selectedDificuldade;
    return matchesSearch && matchesTema && matchesDificuldade;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Questões</h1>
        <div className="flex gap-2">
          <CategoryDialog
            onSuccess={loadData}
          />
          <QuestionDialog
            mode="create"
            onSuccess={loadData}
            trigger={
              <Button className="bg-pink-600 hover:bg-pink-700">
                <BookPlus className="mr-2 h-4 w-4" />
                Nova Questão
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar questão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedTema || 'all'}
          onValueChange={(value) => setSelectedTema(value === 'all' ? null : value)}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os temas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedDificuldade || 'all'}
          onValueChange={(value) => setSelectedDificuldade(value === 'all' ? null : value)}
        >
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as dificuldades</SelectItem>
            <SelectItem value="easy">Fácil</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="hard">Difícil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {question.text}
                </CardTitle>
                <Badge className={`${difficultyColors[question.difficulty]}`}>
                  {difficultyLabels[question.difficulty]}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Tema: {question.category.name}
                  </p>
                  {question.options && question.options.length > 0 && (
                    <div className="space-y-1">
                      {question.options.map((option, index) => (
                        <div key={option.id ?? index} className="flex items-center gap-2">
                          <span className="text-sm">
                            {String.fromCharCode(65 + index)})
                          </span>
                          <p className="text-sm flex-grow line-clamp-1">
                            {option.text}
                          </p>
                          {option.is_answer && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <ViewQuestionDialog question={question} />
                    <QuestionDialog
                      mode="edit"
                      question={question}
                      onSuccess={loadData}
                      trigger={
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-amber-500 hover:text-amber-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(question.id)}
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
              Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
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