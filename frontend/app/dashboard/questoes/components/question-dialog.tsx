'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  createQuestion, 
  updateQuestion, 
  createQuestionOption, 
  updateQuestionOption, 
  deleteQuestionOption,
  fetchCategories, 
  getQuestion,
  Category 
} from '@/services/api';

interface QuestionDialogProps {
  mode: 'create' | 'edit';
  question?: {
    id: number;
    text: string;
    category_id: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: {
      id: number;
      name: string;
    };
    options?: Array<{
      id: number;
      text: string;
      is_answer: boolean;
    }>;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const initialFormState = {
  text: '',
  category_id: '',
  difficulty: 'easy' as const,
  options: [
    { id: 0, text: '', is_answer: true },
    { id: 0, text: '', is_answer: false },
    { id: 0, text: '', is_answer: false },
    { id: 0, text: '', is_answer: false },
  ],
};

export function QuestionDialog({ mode, question, trigger, onSuccess }: QuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  // Estado para os dados atuais do formulário
  const [formData, setFormData] = useState({
    ...initialFormState,
    options: [...initialFormState.options],
  });

  // Armazena as opções removidas para processar a exclusão
  const [deletedOptions, setDeletedOptions] = useState<Array<{ id: number }>>([]);

  // Armazena os dados originais carregados via API
  const [originalQuestion, setOriginalQuestion] = useState<typeof question | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!open) {
        setFormData({
          ...initialFormState,
          options: [...initialFormState.options],
        });
        return;
      }

      try {
        if (mode === 'edit' && question) {
          setLoadingData(true);
          const [questionData, categoriesData] = await Promise.all([
            getQuestion(question.id),
            fetchCategories()
          ]);
          setCategories(categoriesData);
          setOriginalQuestion(questionData);

          // Ordena as opções pelo id (ou outro critério desejado)
          let sortedOptions = Array.isArray(questionData.options)
            ? [...questionData.options].sort((a, b) => a.id - b.id)
            : [...initialFormState.options];

          // Se houver mais de uma opção marcada como correta, mantenha somente a primeira
          if (sortedOptions.filter(o => o.is_answer).length > 1) {
            let foundCorrect = false;
            sortedOptions = sortedOptions.map(o => {
              if (o.is_answer) {
                if (!foundCorrect) {
                  foundCorrect = true;
                  return o;
                } else {
                  return { ...o, is_answer: false };
                }
              }
              return o;
            });
          }

          setFormData({
            text: questionData.text,
            category_id: questionData.category_id.toString(),
            difficulty: questionData.difficulty,
            options: sortedOptions,
          });
        } else {
          const categoriesData = await fetchCategories();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading question data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados da questão',
          variant: 'destructive',
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();

    if (!open) setDeletedOptions([]);
  }, [open, mode, question, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        await createQuestion({
          question: {
            text: formData.text,
            category_id: parseInt(formData.category_id),
            difficulty: formData.difficulty,
          },
          options: formData.options.map(({ id, ...rest }) => rest),
        });
        toast({
          title: 'Sucesso',
          description: 'Questão criada com sucesso',
        });
      } else if (mode === 'edit' && question && originalQuestion) {
        const promises: Promise<any>[] = [];

        if (
          formData.text !== originalQuestion.text || 
          formData.category_id !== originalQuestion.category_id.toString() ||
          formData.difficulty !== originalQuestion.difficulty
        ) {
          promises.push(
            updateQuestion(question.id, {
              text: formData.text,
              category_id: parseInt(formData.category_id),
              difficulty: formData.difficulty,
            })
          );
        }

        const originalOptions = originalQuestion.options || [];
        for (const option of formData.options) {
          if (option.id) {
            const originalOption = originalOptions.find(o => o.id === option.id);
            console.log("Comparando opção atual e original:", { current: option, original: originalOption });
            if (originalOption && (originalOption.text !== option.text || originalOption.is_answer !== option.is_answer)) {
              promises.push(updateQuestionOption(option.id, option.text, option.is_answer));
            }
          } else {
            promises.push(createQuestionOption(question.id, {
              text: option.text,
              is_answer: option.is_answer,
            }));
          }
        }

        for (const removedOption of deletedOptions) {
          promises.push(deleteQuestionOption(removedOption.id));
        }

        await Promise.all(promises);
        toast({
          title: 'Sucesso',
          description: 'Questão atualizada com sucesso',
        });
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting question:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar questão',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = formData.options.map((opt, i) =>
      i === index ? { ...opt, text: value } : opt
    );
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, { id: 0, text: '', is_answer: false }],
      });
    }
  };

  const removeOption = (index: number) => {
    const optionToRemove = formData.options[index];
    // No modo edição não permite remover a alternativa correta
    if (mode === 'edit' && optionToRemove.is_answer) {
      toast({
        title: 'Atenção',
        description: 'Não é possível apagar a alternativa correta',
        variant: 'destructive',
      });
      return;
    }
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      if (optionToRemove.id) {
        setDeletedOptions(prev => [...prev, optionToRemove]);
      }
      // Em modo criação, se a opção removida era a correta, define a primeira como correta
      if (optionToRemove.is_answer && newOptions.length > 0) {
        newOptions[0] = { ...newOptions[0], is_answer: true };
      }
      setFormData({ ...formData, options: newOptions });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pink-600 hover:bg-pink-700">
            {mode === 'create' ? 'Nova Questão' : 'Editar Questão'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Adicionar Nova Questão' : 'Editar Questão'}
          </DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Pergunta</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Tema</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nível de Dificuldade</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value as 'easy' | 'medium' | 'hard' })}
                  disabled={mode === 'edit'} // Dificuldade não editável em modo edição
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Alternativas</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={formData.options.length >= 6}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-medium">
                      {mode === 'create'
                        ? 'Selecione o círculo ao lado da alternativa que será a resposta correta'
                        : 'Esta é a alternativa correta'}
                    </p>
                  </div>

                  {/* Container com rolagem para as alternativas */}
                  <div className="max-h-80 overflow-y-auto">
                    {mode === 'create' ? (
                      <RadioGroup
                        value={formData.options.findIndex(opt => opt.is_answer).toString()}
                        onValueChange={(value) => {
                          const newOptions = formData.options.map((option, index) => ({
                            ...option,
                            is_answer: index.toString() === value,
                          }));
                          setFormData({ ...formData, options: newOptions });
                        }}
                        className="space-y-4"
                      >
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem 
                                value={index.toString()} 
                                id={`alternativa-${index}`} 
                                className="mt-3"
                              />
                              {index.toString() === formData.options.findIndex(opt => opt.is_answer).toString() && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-3" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <Textarea
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                                required
                              />
                            </div>
                            {formData.options.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeOption(index)}
                                className="self-start"
                                disabled={mode === 'edit' && option.is_answer} // Impede a remoção da alternativa correta
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      // Modo edit: não permite alterar qual é a alternativa correta
                      <div className="space-y-4">
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex items-center gap-2">
                              {option.is_answer ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-3" />
                              ) : (
                                <span className="mt-3 w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <Textarea
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                                required
                              />
                            </div>
                            {formData.options.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeOption(index)}
                                className="self-start"
                                disabled={option.is_answer} // Não permite remover a alternativa correta
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                {loading ? 'Salvando...' : mode === 'create' ? 'Adicionar' : 'Salvar'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
