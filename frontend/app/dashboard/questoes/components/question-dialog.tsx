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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  getQuestion,
} from '@/services/questions';
import { fetchCategories, Category } from '@/services/categories';

//
// TIPAGENS
//

// Tipo da questão conforme o retorno da API.
interface QuestionProp {
  id: number;
  text: string;
  category_id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: {
    name: string;
  };
  options?: Array<{
    id: number;
    text: string;
    is_answer: boolean;
  }>;
}

// União discriminada para as props do diálogo

interface CreateQuestionDialogProps {
  mode: 'create';
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

interface EditQuestionDialogProps {
  mode: 'edit';
  question: QuestionProp;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

type QuestionDialogProps = CreateQuestionDialogProps | EditQuestionDialogProps;

// Interface para os dados do formulário
interface FormData {
  text: string;
  category_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: Array<{
    id: number;
    text: string;
    is_answer: boolean;
  }>;
}

const initialFormState: FormData = {
  text: '',
  category_id: '',
  difficulty: 'easy',
  options: [
    { id: 0, text: '', is_answer: true },
    { id: 0, text: '', is_answer: false },
    { id: 0, text: '', is_answer: false },
    { id: 0, text: '', is_answer: false },
  ],
};

export function QuestionDialog(props: QuestionDialogProps) {
  // Não desestruture "mode" para preservar a união discriminada
  const { trigger, onSuccess } = props;
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    ...initialFormState,
    options: [...initialFormState.options],
  });

  // Armazena as opções removidas para posterior exclusão
  const [deletedOptions, setDeletedOptions] = useState<Array<{ id: number }>>([]);

  // Dados originais da questão (somente no modo edição)
  const [originalQuestion, setOriginalQuestion] = useState<QuestionProp | null>(null);

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
        if (props.mode === 'edit') {
          // No modo edição, "question" é obrigatório
          setLoadingData(true);
          const [questionData, categoriesData] = await Promise.all([
            getQuestion(props.question.id),
            fetchCategories(),
          ]);
          setCategories(categoriesData);
          setOriginalQuestion(questionData);

          // Ordena as opções (por exemplo, pelo id)
          let sortedOptions = Array.isArray(questionData.options)
            ? [...questionData.options].sort((a, b) => a.id - b.id)
            : [...initialFormState.options];

          // Caso haja mais de uma opção marcada como correta, mantém somente a primeira
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
          // Modo criação: carrega as categorias
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
  }, [open, props, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (props.mode === 'create') {
        // Modo criação: envia a requisição de criação
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
      } else {
        // Modo edição:
        // Agrupa todas as requisições necessárias para atualizar a questão e as opções
        const promises: Promise<any>[] = [];

        // Atualiza os campos principais da questão se houver alteração
        if (
          formData.text !== originalQuestion?.text ||
          formData.category_id !== originalQuestion?.category_id.toString() ||
          formData.difficulty !== originalQuestion?.difficulty
        ) {
          promises.push(
            updateQuestion(props.question.id, {
              text: formData.text,
              category_id: parseInt(formData.category_id),
              difficulty: formData.difficulty,
            })
          );
        }

        // Atualiza as opções existentes ou cria novas
        const originalOptions = originalQuestion?.options || [];
        for (const option of formData.options) {
          if (option.id) {
            const originalOption = originalOptions.find(o => o.id === option.id);
            if (
              originalOption &&
              (option.text !== originalOption.text ||
                option.is_answer !== originalOption.is_answer)
            ) {
              promises.push(updateQuestionOption(option.id, option.text, option.is_answer));
            }
          } else {
            promises.push(
              createQuestionOption(props.question.id, {
                text: option.text,
                is_answer: option.is_answer,
              })
            );
          }
        }

        // Envia requisições para excluir as opções removidas
        for (const removedOption of deletedOptions) {
          promises.push(deleteQuestionOption(removedOption.id));
        }

        // Envia todas as requisições de uma vez (concorrentemente)
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
    if (props.mode === 'edit' && optionToRemove.is_answer) {
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
      // Se a opção removida era a correta, define a primeira como correta
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
            {props.mode === 'create' ? 'Nova Questão' : 'Editar Questão'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {props.mode === 'create' ? 'Adicionar Nova Questão' : 'Editar Questão'}
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
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Tema</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
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
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      difficulty: value as 'easy' | 'medium' | 'hard',
                    })
                  }
                  disabled={props.mode === 'edit'} // Em modo de edição, a dificuldade não pode ser alterada
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
                      {props.mode === 'create'
                        ? 'Selecione o círculo ao lado da alternativa que será a resposta correta'
                        : 'Esta é a alternativa correta'}
                    </p>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {props.mode === 'create' ? (
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
                              {index.toString() ===
                                formData.options.findIndex(opt => opt.is_answer).toString() && (
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
                                // Em modo "create", não é necessária a checagem do modo; o botão permanece habilitado.
                                disabled={false}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      // Modo de edição: não é permitido alterar qual é a resposta correta
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
                                disabled={option.is_answer}
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
                {loading
                  ? 'Salvando...'
                  : props.mode === 'create'
                  ? 'Adicionar'
                  : 'Salvar'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
